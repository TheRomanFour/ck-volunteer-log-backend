import { Education } from "../model/Education";
import { Managed } from "@juice/juice/core/managed/Managed";
import { Result } from "@juice/juice/types/Result";

export class ManagedEducation extends Managed<Education> {

    constructor(education?: Education) {
        super(Education);

        this.model = education || new Education();
    }

    async updateEducation(): Promise<Result<Education>> {

        return new Result<Education>();
    }
}
