import { Location } from "./Location";
import { User } from "./User";

export interface Event {
    _id: string;
    title: string;
    date: Date;
    defaultPrice: number;
    images: string[];
    organizer: User;
    location: Location;
}