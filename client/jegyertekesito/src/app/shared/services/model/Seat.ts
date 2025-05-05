import { Location } from "./Location";

export interface Seat {
    _id: string;
    row: number;
    number: number;
    category: string;
    location: Location;
}