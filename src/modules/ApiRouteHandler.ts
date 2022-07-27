import { IRouteHandler } from "@juice/networking/routes/IRouteHandler";
import { ExpressRouter } from "sunset-express-rc/lib/ExpressRouter";
import * as cors from "cors";
import { VolunteerController } from "./controllers/VolunteerController";
import {EducationController} from "./controllers/EducationController";

export class ApiRouteHandler implements IRouteHandler {

    router: ExpressRouter;
    options: any;

    constructor() {
        this.router = new ExpressRouter();
        this.router.use(cors());
    }

    async init(): Promise<boolean> {
        this.router.addController("/volunteer", new VolunteerController());
        this.router.addController("/education", new EducationController());
        return true;
    }

    getRouter(): ExpressRouter {
        return this.router;
    }

    setOptions(options) {
        this.options = options;
    }


}


