import { Container } from "inversify";
import { SignonController } from "../controller/signon-controller";
import { SignonService } from "../service/signon-service";
import { TYPES } from "./types";
import { ProfileRepository } from "../repository/profile-repository";


const container = new Container();
container.bind<SignonController>(TYPES.SignonController).to(SignonController);
container.bind<SignonService>(TYPES.SignonService).to(SignonService);
container.bind<ProfileRepository>(TYPES.ProfileRepository).to(ProfileRepository);

export { container };
