import { Router, Request, Response, NextFunction } from "express";
import { MainClass } from "../main-class";
import { PassportStatic } from "passport";
import { User } from "../model/User";
import { Event } from "../model/Event";
import { asyncHandler } from "../utils/asyncHandler";
import { Location } from "../model/Location";
import { Order } from "../model/Order";
import { Seat } from "../model/Seat";
import { Ticket } from "../model/Ticket";


export const configureRoutes = (passport: PassportStatic, router: Router): Router => {
    router.get("/", (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.status(200).send("Hello World!");
    });
    
    router.get("/checkAuth", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(500).send(false);
        }
    });

    router.get("/checkAdminAuth", async (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
          try {
            const userId = req.user as String;
            const user = await User.findById(userId).select("-password");
            if (user) {
              res.status(200).send(user);
            } else {
              res.status(400).send("User not found");
            }
          } catch (error) {
            console.error("Error fetching user in /checkAdminAuth:", error);
            res.status(500).send("Internal server error!");
          }
        } else {
          res.status(400).send("Not authenticated!");
        }
      });

    router.post("/register", (req: Request, res: Response) => {
        const nickname = req.body.nickname;
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const address = req.body.address;
        const telephone = req.body.telephone;
        const isAdmin = req.body.isAdmin;
        const user = new User({nickname: nickname, email: email, password: password, name: name, address: address, telephone: telephone, isAdmin: isAdmin});
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });

    router.post("/login", (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate("local", (error: string | null, user: typeof User) => {
            if (error) {
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send("User not found!");
                } else {
                    req.login(user, (error2: string | null) => {
                        if (error2) {
                            res.status(500).send("Internal server error!");
                        } else {
                            res.status(200).send(user);
                        }
                    });
                }    
            }
        }) (req, res, next);
    });

    router.post("/logout", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    res.status(500).send("Internal server error! " + error);
                }
                res.status(200).send("Successfully logged out!");
            });
        } else {
            res.status(500).send("User is not logged in!");
        }
    });

    router.get("/getAllUsers", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("User is not logged in!");
        }
  
        const userId = req.user as string;
        const user = await User.findById(userId);

        if (!user || !user.isAdmin) {
            return res.status(400).send("Access denied. Admins only.");
        }

        const query = User.find();
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    }));

    router.get("/getOneUser", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User.findById(id);
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send("Internal server error!");
            })
        } else {
            res.status(500).send("User is not logged in!");
        }
    });

    router.put("/updateUser", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
          return res.status(400).send("User is not logged in!");
        }
      
        const id = req.query.id;
        const updateData = req.body;
      
        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });
      
        if (!updatedUser) {
          return res.status(400).send("User not found.");
        }
      
        res.status(200).send(updatedUser);
      }));

    router.delete("/deleteUser", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User.findOneAndDelete({_id: id});
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send("Internal server error!");
            })
        } else {
            res.status(500).send("User is not logged in!");
        }
    });

    //Events
    router.get("/getAllEvents", (req: Request, res: Response) => {
        const query = Event.find().populate("organizer").populate("location");
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    });

    router.get("/eventDetails", (req: Request, res: Response) => {
        const id = req.query.id;
        const query = Event.findById(id).populate("organizer").populate("location");
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    });

    router.post("/createEvent", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }

        const userId = req.user as string;
        const user = await User.findById(userId);
      
        if (!user || !user.isAdmin) {
          return res.status(400).send("Access denied. Admins only.");
        }

        const title = req.body.title;
        const date = req.body.date;
        const defaultPrice = req.body.defaultPrice;
        const organizer = req.body.organizer;
        const location = req.body.location;
        const images = JSON.parse(req.body.images);
        const event = new Event({title: title, date: date, defaultPrice: defaultPrice, images: images, organizer: organizer, location: location});
        event.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
    }));

    router.put("/updateEvent", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
          return res.status(400).send("Not authenticated.");
        }
      
        const userId = req.user as string;
        const user = await User.findById(userId);
      
        if (!user || !user.isAdmin) {
          return res.status(400).send("Access denied. Admins only.");
        }
      
        const eventId = req.query.id;
        const updateData = req.body;
      
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
          new: true,
          runValidators: true,
        }).populate("organizer").populate("location");
      
        if (!updatedEvent) {
          return res.status(500).send("Event not found.");
        }
      
        res.status(200).send(updatedEvent);
      }));

    router.delete("/deleteEvent", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }
        
        const userId = req.user as string;
        const user = await User.findById(userId);
        
        if (!user || !user.isAdmin) {
            return res.status(400).send("Access denied. Admins only.");
        }

        const id = req.query.id;
        
        const relatedOrders = await Order.countDocuments({ event: id });
        if (relatedOrders > 0) {
            return res.status(400).send("Not allowed to delete event! There are related Orders left!");
        }
        const relatedTickets = await Ticket.countDocuments({ event: id });
        if (relatedTickets > 0) {
            return res.status(400).send("Not allowed to delete event! There are related Tickets left!");
        }

        const query = Event.findOneAndDelete({_id: id});
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    }));

    //Location
    router.get("/getAllLocations", (req: Request, res: Response) => {
        const query = Location.find();
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    });

    router.get("/getOneLocation", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = Location.findById(id);
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send("Internal server error!");
            })
        } else {
            res.status(500).send("User is not logged in!");
        }
    });

    router.post("/createLocation", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }

        const userId = req.user as string;
        const user = await User.findById(userId);
      
        if (!user || !user.isAdmin) {
          return res.status(400).send("Access denied. Admins only.");
        }

        const name = req.body.name;
        const address = req.body.address;
        const rows = req.body.rows;
        const columns = req.body.columns;
        const location = new Location({name: name, address: address, rows: rows, columns: columns});
        location.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    }));

    router.put("/updateLocation", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
          return res.status(400).send("Not authenticated.");
        }
      
        const userId = req.user as string;
        const user = await User.findById(userId);
      
        if (!user || !user.isAdmin) {
          return res.status(400).send("Access denied. Admins only.");
        }
      
        const locationId = req.query.id;
        const updateData = req.body;
      
        const updatedLocation = await Location.findByIdAndUpdate(locationId, updateData, {
          new: true,
          runValidators: true,
        });
      
        if (!updatedLocation) {
          return res.status(500).send("Location not found.");
        }
      
        res.status(200).send(updatedLocation);
    }));

    router.delete("/deleteLocation", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }
        
        const userId = req.user as string;
        const user = await User.findById(userId);
        
        if (!user || !user.isAdmin) {
            return res.status(400).send("Access denied. Admins only.");
        }

        const id = req.query.id;
        const query = Location.findOneAndDelete({_id: id});
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    }));

    //Order
    router.get("/getAllOrders", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }

        const userId = req.user as string;
        const user = await User.findById(userId);
      
        if (!user || !user.isAdmin) {
          return res.status(400).send("Access denied. Admins only.");
        }

        const query = Order.find().populate("user").populate("event");
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    }));

    router.get("/getOneOrder", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = Order.findById(id).populate("user").populate("event");
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send("Internal server error!");
            })
        } else {
            res.status(500).send("User is not logged in!");
        }
    });

    router.get("/getAllOrdersByUserId/:userId", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }

        try {
            const orders = await Order.find({ user: req.params.userId }).populate("user").populate("event");
            res.status(200).send(orders);
        } catch (error) {
            res.status(500).send({ message: 'Failed to get orders by given user.' });
        }
    }));

    router.post("/createOrder", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }

        const orderDate = req.body.orderDate;
        const status = req.body.status;
        const userData = req.body.user;
        const event = req.body.event;
        const location = new Order({orderDate: orderDate, status: status, user: userData, event: event});
        location.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    }));

    router.put("/updateOrder", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
          return res.status(400).send("Not authenticated.");
        }
      
        const userId = req.user as string;
        const user = await User.findById(userId);
      
        if (!user || !user.isAdmin) {
          return res.status(400).send("Access denied. Admins only.");
        }
      
        const orderId = req.query.id;
        const updateData = req.body;
      
        if (!["pending", "confirmed", "cancelled", "compleated"].includes(updateData.status)) {
            return res.status(400).send("Invalid status value.");
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
          new: true,
          runValidators: true,
        }).populate("user").populate("event");
      
        if (!updatedOrder) {
          return res.status(500).send("Order not found.");
        }
      
        res.status(200).send(updatedOrder);
    }));

    router.put("/cancelOrder", asyncHandler(async (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
          const orderId = req.query.id;
          const updateData = req.body;
          
          const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
            new: true,
            runValidators: true,
          }).populate("user").populate("event");

          if (!updatedOrder) {
            return res.status(500).send("Order not found.");
          }
        
          res.status(200).send(updatedOrder);
        } else {
          res.status(400).send("Not authenticated!");
        }
    }));

    router.delete("/deleteOrder", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }
        
        const userId = req.user as string;
        const user = await User.findById(userId);
        
        if (!user || !user.isAdmin) {
            return res.status(400).send("Access denied. Admins only.");
        }

        const id = req.query.id;
        const query = Order.findOneAndDelete({_id: id});
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    }));

    //Seat
    router.get("/getAllSeats", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }

        const userId = req.user as string;
        const user = await User.findById(userId);
      
        if (!user || !user.isAdmin) {
          return res.status(400).send("Access denied. Admins only.");
        }

        const query = Seat.find().populate("location");
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    }));

    router.get("/getSeatsByLocation/:locationId", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }

        try {
            const seats = await Seat.find({ location: req.params.locationId }).populate("location");
            res.status(200).send(seats);
        } catch (error) {
            res.status(500).send({ message: 'Failed to get seats by given location.' });
        }
    }));

    router.get("/getOneSeat", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = Seat.findById(id).populate("location");
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send("Internal server error!");
            })
        } else {
            res.status(500).send("User is not logged in!");
        }
    });

    router.post("/createSeat", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }

        const userId = req.user as string;
        const user = await User.findById(userId);
      
        if (!user || !user.isAdmin) {
          return res.status(400).send("Access denied. Admins only.");
        }

        const row = req.body.row;
        const number = req.body.number;
        const category = req.body.category;
        const location = req.body.location;
        const seat = new Seat({row: row, number: number, category: category, location: location});
        seat.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    }));

    router.put("/updateSeat", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
          return res.status(400).send("Not authenticated.");
        }
      
        const userId = req.user as string;
        const user = await User.findById(userId);
      
        if (!user || !user.isAdmin) {
          return res.status(400).send("Access denied. Admins only.");
        }
      
        const seatId = req.query.id;
        const updateData = req.body;
      
        const updatedSeat = await Seat.findByIdAndUpdate(seatId, updateData, {
          new: true,
          runValidators: true,
        }).populate("location");
      
        if (!updatedSeat) {
          return res.status(500).send("Seat not found.");
        }
      
        res.status(200).send(updatedSeat);
    }));

    router.delete("/deleteSeat", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }
        
        const userId = req.user as string;
        const user = await User.findById(userId);
        
        if (!user || !user.isAdmin) {
            return res.status(400).send("Access denied. Admins only.");
        }

        const id = req.query.id;
        const query = Seat.findOneAndDelete({_id: id});
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    }));

    router.delete("/deleteAllSeats", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }
        
        const userId = req.user as string;
        const user = await User.findById(userId);
        
        if (!user || !user.isAdmin) {
            return res.status(400).send("Access denied. Admins only.");
        }

        const locationId = req.query.locationId;
        const query = Seat.deleteMany({location: locationId});
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    }));

    router.post("/generateSeats", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }
    
        const userId = req.user as string;
        const user = await User.findById(userId);
    
        if (!user || !user.isAdmin) {
        return res.status(400).send("Access denied. Admins only.");
        }
      
        const locationId = req.body.locationId;
        const location = await Location.findById(locationId);
        
        if (!location) {
            return res.status(400).send("Location not found!");
        }

        const createdSeats = [];
        const rows = location.rows.valueOf();
        const columns = location.columns.valueOf();

        for (let row = 1; row <= rows; row++) {
            for (let number = 1; number <= columns; number++) {
                try {
                    const seat = new Seat({ row, number, location: location._id });
                    await seat.save();
                    createdSeats.push(seat);
                } catch (err: any) {
                    console.error(`Error creating seat at ${row}|${number}`, err);
                }
            }
        }
      
        res.status(200).send(createdSeats);
      }));

    //Ticket
    router.get("/getAllTickets", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }

        const userId = req.user as string;
        const user = await User.findById(userId);
      
        if (!user || !user.isAdmin) {
          return res.status(400).send("Access denied. Admins only.");
        }

        const query = Ticket.find().populate("order").populate("seat").populate("event");
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    }));

    router.get("/getTicketsByEvent/:eventId", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }

        try {
            const seats = await Ticket.find({ event: req.params.eventId }).populate({path: "order", populate: { path: 'user' }}).populate("seat").populate("event");
            res.status(200).send(seats);
        } catch (error) {
            res.status(500).send({ message: 'Failed to get tickets by given event.' });
        }
    }));

    router.get("/getOneTicket", (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = Ticket.findById(id).populate("order").populate("seat").populate("event");
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send("Internal server error!");
            })
        } else {
            res.status(500).send("User is not logged in!");
        }
    });

    router.post("/createTicket", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }

        const discount = req.body.discount;
        const order = req.body.order;
        const seat = req.body.seat;
        const event = req.body.event;
        const ticket = new Ticket({discount: discount, order: order, seat: seat, event: event});
        ticket.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    }));

    router.put("/updateTicket", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
          return res.status(400).send("Not authenticated.");
        }
      
        const userId = req.user as string;
        const user = await User.findById(userId);
      
        if (!user || !user.isAdmin) {
          return res.status(400).send("Access denied. Admins only.");
        }
      
        const ticketId = req.query.id;
        const updateData = req.body;
      
        const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updateData, {
          new: true,
          runValidators: true,
        }).populate("order").populate("seat").populate("event");
      
        if (!updatedTicket) {
          return res.status(500).send("Ticket not found.");
        }
      
        res.status(200).send(updatedTicket);
    }));

    router.delete("/deleteTicket", asyncHandler(async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).send("Not authenticated.");
        }
        
        const userId = req.user as string;
        const user = await User.findById(userId);
        
        if (!user || !user.isAdmin) {
            return res.status(400).send("Access denied. Admins only.");
        }

        const id = req.query.id;
        const ticket = await Ticket.findById(id);
        const order = await Order.findById(ticket?.order);
        
        if (order === null || order === undefined || (order.status !== "compleated" && order.status !== "cancelled")) {
            return res.status(500).send("The status of the order is not compleated/cancelled or the order is missing!");
        }
        
        const query = Ticket.findOneAndDelete({_id: id});
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send("Internal server error!");
        })
    }));


    return router;
}
