import { IRouteHandler } from "@juice/networking/routes/IRouteHandler";
import { ExpressRouter } from "sunset-express-rc/lib/ExpressRouter";
import * as cors from  "cors";
import { VolunteerController } from "./controllers/VolunteerController";

export class ApiRouteHandler implements IRouteHandler {

    router:ExpressRouter;

    constructor(){
        this.router=new ExpressRouter();
        this.router.use(cors());
    }
    
    async init(): Promise<boolean> {
        this.router.addController("/volunteer", new VolunteerController());
        return true;
    }
    getRouter(): ExpressRouter {
        return this.router;
    }


}


