import { ExpressController, Get, Post, Delete, Put} from "sunset-express-rc/lib/ExpressController";
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

    @Post("/:page/:pageSize")
    async fetch(req: express.Request, res: express.Response): Promise<express.Response> {
        const page = Number(req.params.page);
        const pageSize = Number(req.params.pageSize);
        const options = req.body;
        if (isNaN(page) || isNaN(pageSize) || pageSize < 1 || pageSize > 1000)
            return res.send({success: false, error: "INVALID_DATA"});

        const result = await this.educations.fetch(page, pageSize, options);
        return res.send(result)


    }

    @Delete("/:id")
    async deleteEducation(req: express.Request, res: express.Response): Promise<express.Response> {
        if (!ObjectId.isValid(req.params.id))
            return res.send({ success: false, error: "INVALID_DATA" });

        const result = await this.educations.delete(new ObjectId(req.params.id));
        return res.send(result);
    }
    @Put("/:id")
    async update(req: express.Request, res: express.Response): Promise<express.Response> {
        if (!ObjectId.isValid(req.params.id) || !req.body)
            return res.send({ success: false, error: "INVALID_DATA" });
        const result = await this.educations.update(new ObjectId(req.params.id), req.body);
        return res.send(result);
    }



}
