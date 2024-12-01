import { Container } from "inversify";
import { SignonController } from "../controller/signon-controller";
import { SignonService } from "../service/signon-service";
import { TYPES } from "./types";


const container = new Container();
container.bind<SignonController>(TYPES.SignonController).to(SignonController);
container.bind<SignonService>(TYPES.SignonService).to(SignonService);

export { container };
