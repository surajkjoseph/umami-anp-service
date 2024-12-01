import { injectable } from "inversify";
import Profile from "../entity/profile";

@injectable()
export class ProfileRepository{

    async findProfileByEmail(email:string) : Promise<any> {
        return await Profile.find({email : email});
    }

    async saveProfile(profile:any): Promise<any>{
        if(!profile){
            return await profile.save();
        }
    }
}