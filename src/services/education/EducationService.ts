import { IService } from "@juice/juice/core/service/IService";
import { EducationProvider } from "./provider/EducationProvider";
import { ServiceConfiguration } from "@juice/juice/core/decorators/ServiceConfiguration";
import { FetchResult, Result } from "@juice/juice/types/Result";
import { ObjectId } from "mongodb";
import { ManagedEducation } from "./managed/ManagedEducation";
import { Education } from "./model/Education";
import { Options } from "@juice/juice/core/provider/IProvider";

@ServiceConfiguration({
    key: "ck-volunteer:educations",
    options: {}
})
export class EducationService implements IService {

    options: any;
    private provider: EducationProvider = new EducationProvider();

    async onUpdate(options: any): Promise<boolean> {
        this.options = options;

        return true;
    }

    async create(data: any): Promise<Result<ObjectId>> {
        const mEducation = new ManagedEducation();

        mEducation.model.name = data.name;
        mEducation.model.date_from = data.date_from;
        mEducation.model.date_to = data.date_to;
        mEducation.model.location = data.location;
        mEducation.model.start_time = data.start_time;
        mEducation.model.maximum_participants = data.maximum_participants;

        await mEducation.save();

        return new Result<ObjectId>(mEducation._id);
    }



    async fetch(page: number, pageSize: number, options?: Options): Promise<FetchResult<Education>> {
        const result = await this.provider.fetch([], page, pageSize, options);

        return new Result({ count: result.count, items: result.toModel() });
    }

    async fetchById(_id: ObjectId): Promise<Result<Education>> {
        const result = await this.provider.fetchById(_id);
        if (!result)
            return new Result(false, "MISSING_EDUCATION");

        return new Result(result.model);
    }


    async update(_id: ObjectId, data: any): Promise<Result<Education>> {
        const Education = await this.provider.fetchById(_id);
        if (!Education || !Education._id)
            return new Result(false, "MISSING_ENTITY");

        const result = await Education.update(data);
        if (!result.success)
            return result;

        return new Result();
    }

    async delete(_id: ObjectId): Promise<Result<any>> {

        const Education = await this.provider.fetchById(_id);
        if (!Education || !Education._id)
            return new Result(false, "MISSING_ENTITY");

        const result = await Education.delete();
        if (!result != true)
            return ;

        return new Result();
    }



}
