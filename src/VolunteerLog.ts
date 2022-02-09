import {IJuiceApplication} from "@juice/juice/core/IJuiceApplication"
import {ApplicationConfiguration} from "@juice/juice/core/decorators/ApplicationConfiguration";
import {Juice} from "@juice/juice/Juice";
import {LanguageModule} from "@juice/juice/modules/LanguageModule";
import {ColoredConsoleLogger} from "@juice/juice/modules/logging/ColoredConsoleLogger";
import {Networking} from "@juice/networking/Networking";
import { ApiRouteHandler } from './modules/ApiRouteHandler';

@ApplicationConfiguration({
    key: "ck-volunteer",
    options: {
        logger: "logger:colored-console"
    }
})

export class VolunteerLog implements IJuiceApplication {
    options?: any;
    async configure(): Promise<boolean> {
        return true  
    }
    async prepare() {
        Juice.install(LanguageModule);
        Juice.register(ColoredConsoleLogger);
        return true;
     }
    async ready(): Promise<any> {
        const networking =Juice.service<Networking>("networking");
        await networking.deployRoute("/api", new ApiRouteHandler());
        return true;
      }
}