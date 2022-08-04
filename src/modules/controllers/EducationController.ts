import { ExpressController, Get, Post } from "sunset-express-rc/lib/ExpressController";
import * as express from "express";
import { Inject } from "@juice/juice/core/decorators/Inject";
import { EducationService } from "../../services/education/EducationService";
import { ObjectId } from "mongodb";

export class EducationController extends ExpressController {

    @Inject("ck-volunteer:educations")
    private educations: EducationService;

    @Get("/:id")
    async fetchById(req: express.Request, res: express.Response): Promise<express.Response> {
        if (!ObjectId.isValid(req.params.id))
            return res.send({ success: false });

        const result = await this.educations.fetchById(new ObjectId(req.params.id));
        return res.send(result);
    }

    @Post("/")
    async create(req: express.Request, res: express.Response): Promise<express.Response> {
        if (!req.body)
            return res.send({ success: false });

        //Validate mandatory data
        const result = await this.educations.create(req.body);
        return res.send(result);
    }

}
