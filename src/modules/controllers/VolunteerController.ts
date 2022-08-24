import { ExpressController, Get, Post, Put, Delete } from "sunset-express-rc/lib/ExpressController";
import * as express from "express";
import { Inject } from "@juice/juice/core/decorators/Inject";
import { VolunteerService } from "../../services/volunteer/VolunteerService";
import { ObjectId } from "mongodb";
import { Education } from "../../services/education/model/Education";

export class VolunteerController extends ExpressController {

    @Inject("ck-volunteer:volunteers")
    private volunteers: VolunteerService;

    @Get("/:id")
    async getVolunteer(req: express.Request, res: express.Response): Promise<express.Response> {
        if (!ObjectId.isValid(req.params.id))
            return res.send({ success: false, error: "INVALID_DATA" });

        const result = await this.volunteers.provider.fetchById(new ObjectId(req.params.id));
        if (!result || !result._id)
            return res.send({ success: false, error: "MISSING_VOLUNTEER" });

        if (result.model.attributes?.education_ids?.length) {
            const educations = await Education.find<Education>({ _id: { $in: result.model.attributes.education_ids } }).toArray();
            result.model.attributes.educations = educations;
        }

        return res.send({
            success: true,
            payload: result.model
        });
    }

    @Post("/:page/:pageSize/:term?")
    async fetch(req: express.Request, res: express.Response): Promise<express.Response> {
        const page = Number(req.params.page);
        const pageSize = Number(req.params.pageSize);
        const options = req.body;
        if (isNaN(page) || isNaN(pageSize) || pageSize < 1 || pageSize > 1000)
            return res.send({ success: false, error: "INVALID_DATA" });

        const query = req.params.term
            ? [{
                $match: {
                    $or: [
                        { email: new RegExp(req.params.term, "i") },
                        { firstname: new RegExp(req.params.term, "i") },
                        { lastname: new RegExp(req.params.term, "i") }
                    ]
                }
            }]
            : [];
        const result = await this.volunteers.provider.fetch(query, page, pageSize, options);
        return res.send({
            success: true,
            payload: {
                count: result.count,
                items: result.toModel()
            }
        });
    }

    @Post("/")
    async create(req: express.Request, res: express.Response): Promise<express.Response> {
        if (!req.body)
            return res.send({ success: false, error: "INVALID_DATA" });

        //Make validation for mandatory data (hint: Check type VolunteerFormData)
        if (!req.body.firstname)
            return res.send({ success: false, error: "MISSING_FIRSTNAME" });

        if (!req.body.lastname)
            return res.send({ success: false, error: "MISSING_LASTNAME" });

        //Here you can check if user with that firstname and lastname is already existing (not to have duplicate volunteers)

        const result = await this.volunteers.createEntity(req.body);
        return res.send(result);
    }

    @Put("/:id")
    async update(req: express.Request, res: express.Response): Promise<express.Response> {
        if (!ObjectId.isValid(req.params.id) || !req.body)
            return res.send({ success: false, error: "INVALID_DATA" });

        const result = await this.volunteers.update(new ObjectId(req.params.id), req.body);
        return res.send(result);
    }

    @Delete("/:id")
    async deleteVolunteer(req: express.Request, res: express.Response): Promise<express.Response> {
        if (!ObjectId.isValid(req.params.id))
            return res.send({ success: false, error: "INVALID_DATA" });

        const result = await this.volunteers.delete(new ObjectId(req.params.id));
        return res.send(result);
    }
}
