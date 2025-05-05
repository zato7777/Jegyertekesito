import { Event } from "./Event";
import { User } from "./User";

export interface Order {
    _id: string;
    orderDate: Date;
    status: string;
    user: User;
    event: Event;
}