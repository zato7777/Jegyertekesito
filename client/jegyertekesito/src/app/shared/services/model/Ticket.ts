import { Event } from "./Event";
import { Order } from "./Order";
import { Seat } from "./Seat";

export interface Ticket {
    _id: string;
    discount: string;
    order: Order;
    seat: Seat;
    event: Event;
}