import { ServiceConfiguration } from "@juice/juice/core/decorators/ServiceConfiguration";
import { EntityService } from "@juice/entities/EntityService";
import { ManagedEntity } from "@juice/entities/managed/ManagedEntity";
import { IEntityProvider } from "@juice/entities/provider/IEntityProvider";
import { Result } from "@juice/juice/types/Result";
import { Entity } from "@juice/entities/models/Entity";
import { ObjectId } from "mongodb";
import { AddressFormData } from "@juice/entities/models/Address";

@ServiceConfiguration({
    key: "ck-volunteer:volunteers",
    options: {}
})
export class VolunteerService extends EntityService {

    options: any;
    provider: IEntityProvider = this.entities();

    async onUpdate(options: any): Promise<boolean> {
        this.options = options;
        return true;
    }

    async createEntity(data: VolunteerFormData, sessionUserId?: ObjectId, sessionOrganisationId?: ObjectId): Promise<Result> {
        const entity = new Entity();

        entity.type = "volunteer";
        entity.firstname = data.firstname;
        entity.lastname = data.lastname;
        entity.email = data.email;
        entity.phone = data.phone;
        entity.salutation = data.salutation; //Mr || Mrs

        //entity.attributes = data.attributes; //In this JSON you can write anything (for example date of birth, equipment size)
    
        entity.addresses = [];

        if (data.attributes && data.attributes.dateOfBirth)
            data.attributes.dateOfBirth = new Date(data.attributes.dateOfBirth); //Format Example: 2022, 0, 1 -> 1.1.2022
        entity.attributes = {
            oib: data.oib,
            skills: data.skills,
            place_of_birth: data.place_of_birth,
            date_of_birth: data.date_of_birth
        };


        await entity.save(); //Save new entity to database


        const mEntity = new ManagedEntity(entity);
        if (data.address)
            await mEntity.addAddress(data.address); //Add address to entity if there is any

        return new Result(entity._id);
    }

    async update(_id: ObjectId, data: VolunteerFormData): Promise<Result> {
        const entity = await this.provider.fetchById(_id);
        if (!entity || !entity._id)
            return new Result(false, "MISSING_ENTITY");

        data.attributes = {
            ...data.attributes,
            oib: data.oib,
            skills: data.skills,
            place_of_birth: data.place_of_birth,
            date_of_birth: data.date_of_birth
        };

        const tempAddress = { ...data.address };
        delete data.address;

        const result = await entity.update(data);
        if (!result.success)
            return result;

        await this.updateAddress(_id, tempAddress);

        return new Result();
    }

    async delete(_id: ObjectId): Promise<Result> {
        const entity = await this.provider.fetchById(_id);
        if (!entity || !entity._id)
            return new Result(false, "MISSING_ENTITY");

        const result = await entity.deleteEntity();
        if (!result.success)
            return result;

        return new Result();
    }

    async addEducation(_id: ObjectId, education_id: ObjectId): Promise<Result<Entity>> {
        const volunteer = await this.provider.fetchById(_id);
        if (!volunteer || !volunteer._id)
            return new Result(false, "MISSING_ENTITY");

        const educations: ObjectId[] = volunteer.model.attributes?.education_ids ?? [];
        if (educations.findIndex(eId => eId.equals(education_id) < 0))
            educations.push(education_id);

        await volunteer.setAttribute("education_ids", educations);

        return new Result();
    }

}

type VolunteerFormData = {
    firstname: string,
    lastname: string,
    email?: string,
    phone?: string,
    oib: string;
    place_of_birth: string;
    date_of_birth: string;
    skills?: string;
    salutation?: string,
    attributes?: any,
    address?: AddressFormData
}


