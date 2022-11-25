import { AProvider } from "@juice/juice/core/provider/AProvider";
import { ManagedEducation } from "../managed/ManagedEducation";
import { Education } from "../model/Education";
import { Options, Term } from "@juice/juice/core/provider/IProvider";
import { ManagedCollection } from "@juice/juice/core/managed/ManagedCollection";

export class EducationProvider extends AProvider<ManagedEducation, Education> {


    async fetchById(id, options?: any): Promise<ManagedEducation> {
        const fields: any = {};
        if (options?.fields) {
            options.fields.forEach(f => {
                fields[f] = true;
            });
        }

        let education: any = await Education.findOne<Education>({ _id: id }, { projection: fields });
        if (!education)
            return null;

        education = new ManagedEducation(education);
        return education;
    }


    async fetch(query: any, page: number, pageSize: number, options?: Options | undefined): Promise<ManagedCollection<ManagedEducation, Education>> {
        const fields: any = {};
        if (options && options.fields) {
            options.fields.forEach(f => {
                fields[f] = true;
            });
            query.push({ $project: fields });
        }
        //filter
        if (options?.filter?.length)
            query.push(...this.prepareFilter(options.filter))
        //sort
        if (options && options.sort) {
            const sort = {};
            sort[options.sort.prop] = options.sort.dir === 'asc' ? 1 : -1;
            query.push({ $sort: sort });
        }
        //count
        query.push({
            $group: { _id: null, count: { $sum: 1 } }
        });
        const countQuery = await Education.aggregate(query).toArray();
        const count = countQuery.length ? (countQuery[0] as any).count : 0;
        query.splice(-1);

        //paginate
        if (pageSize) {
            query.push({ $skip: page * pageSize });
            query.push({ $limit: pageSize });
        }

        const education = await Education.aggregate<Education>(query).toArray();
        const educationsSet = new ManagedCollection<ManagedEducation, Education>();
        educationsSet.items = education.map(e => new ManagedEducation(e));
        educationsSet.count = count;

        return educationsSet;
    }



    fetchMeta(query: Array<any>, page: number | undefined, pageSize: number | undefined): Promise<any> {
        return Promise.resolve(undefined);
    }

    async fetchOne(query: any, options?: any): Promise<ManagedEducation> {
        const fields: any = {};
        if (options?.fields) {
            options.fields.forEach(f => {
                fields[f] = true;
            });
        }

        let education: any = await Education.findOne<Education>(query, { projection: fields });
        if (!education)
            return null;

        education = new ManagedEducation(education);
        return education;
    }

    search(terms: Array<Term>, page: number, pageSize: number, options?: Options | undefined): Promise<ManagedCollection<ManagedEducation, Education>> {
        return Promise.resolve(undefined);
    }

}
