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
        if (data.attributes && data.attributes.dateOfBirth)
            data.attributes.dateOfBirth = new Date(data.attributes.dateOfBirth); //Format Example: 2022, 0, 1 -> 1.1.2022
        entity.attributes = data.attributes; //In this JSON you can write anything (for example date of birth)

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

        const result = await entity.update(data);
        if (!result.success)
            return result;

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

}

type VolunteerFormData = {
    firstname: string,
    lastname: string,
    email?: string,
    phone?: string,
    salutation?: string,
    attributes?: any,
    address?: AddressFormData
}


