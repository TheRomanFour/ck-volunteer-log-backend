import {ExpressController, Get} from "sunset-express-rc/lib/ExpressController";
import * as express from "express";

export class VolunteerController extends ExpressController {

    @Get("/")
    async getVolunteer(req:express.Request, res:express.Response ){
        return res.send({
            success:true,
            payload: {
                first_name: "Pero ",
                last_name: "Peric",
                
            }

        })


    }
}