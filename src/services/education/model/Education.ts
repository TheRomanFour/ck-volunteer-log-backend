import { Model, Collection } from "sunshine-dao/lib/Model";

@Collection("educations")
export class Education extends Model {

    name: string;
    date_from: Date;
    date_to: Date;
    location: string;

    start_time?: string; //09:00
    type?: string;
    attributes?: any;
    maximum_participants?: number;
    description?: string;
}
