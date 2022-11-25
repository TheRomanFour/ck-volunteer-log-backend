import { Juice } from "@juice/juice/Juice";
import { VolunteerLog } from "../src/VolunteerLog";

process.on('unhandledRejection', (reason, p) => {
    console.error(reason);
    console.error(p);
});

process.on('uncaughtException', (e) => {
    console.error(e);
    
});
//EmrcGTjmvpXsj6C  sifra za cluster
//const db = { connectionString: "mongodb+srv://Cpt_Shime:EmrcGTjmvpXsj6C@ck-cluster.jk18p.mongodb.net/?retryWrites=true&w=majority" };

const db = {connectionString: "mongodb+srv://User_admin:Sifrajedan1@ck-cluster.jk18p.mongodb.net/?retryWrites=true&w=majority"};

Juice.init().connect(db).start(VolunteerLog).then(res => {

});

