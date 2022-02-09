import { Juice } from "@juice/juice/Juice";
import { VolunteerLog } from "../src/VolunteerLog";

process.on('unhandledRejection', (reason, p) => {
    console.error(reason);
    console.error(p);
});

process.on('uncaughtException', (e) => {
    console.error(e);
    
});

const db = { connectionString: "mongodb://localhost:27017/ck-volunteers" };
Juice.init().connect(db).start(VolunteerLog).then(res => {

});

