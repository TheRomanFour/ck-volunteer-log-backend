import { IJuiceApplication } from "@juice/juice/core/IJuiceApplication";
import { ApplicationConfiguration } from "@juice/juice/core/decorators/ApplicationConfiguration";
import { Juice } from "@juice/juice/Juice";
import { LanguageModule } from "@juice/juice/modules/LanguageModule";
import { ColoredConsoleLogger } from "@juice/juice/modules/logging/ColoredConsoleLogger";
import { Networking } from "@juice/networking/Networking";
import { ApiRouteHandler } from './modules/ApiRouteHandler';
import { Logging } from "@juice/juice/modules/logging/Logging";
import { VolunteerService } from "./services/volunteer/VolunteerService";
import { EducationService } from "./services/education/EducationService";

@ApplicationConfiguration({
    key: "ck-volunteer",
    options: {
        logger: "logger:colored-console"
    }
})

export class VolunteerLog implements IJuiceApplication {
    options?: any;

    async configure(): Promise<boolean> {
        return true;
    }

    async prepare() {
        Juice.install(LanguageModule);
        Juice.register(ColoredConsoleLogger);

        //Juice services
        Juice.install(Networking);
        //Local services
        Juice.install(VolunteerService);
        Juice.install(EducationService);
        return true;
    }

    async ready(): Promise<any> {
        const networking = Juice.service<Networking>("networking");

        await networking.deployRoute("/api", new ApiRouteHandler());

        const log = Juice.service<Logging>("juice:logging");
        log.info("CK VOLUNTEER", "App ready");

        return true;
    }
}
