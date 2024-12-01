import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { SignupRequest } from "../dto/request/signup-request";
import Profile from "../entity/profile";
import { TYPES } from "../config/types";
import { ProfileRepository } from "../repository/profile-repository";
import { default as bcrypt } from 'bcryptjs'

const stripe = new Stripe("sk_test_51QMAmWHDjSLebidMafJsExxIgjXsNnEi0z3Kr4XFb8MeT5eqWETiLjXf2peHJW1YvkCqEIl6kSMsSGPAtfmJt95K00Z6P7mcrS");

@injectable()
export class SignonService{

    constructor(
        @inject(TYPES.ProfileRepository) private repository : ProfileRepository
    ){}

    async register(signupRequest : SignupRequest) : Promise<any> {
      
        if(!signupRequest.email || !signupRequest.password){
            throw new Error ("Email and Password is mandatory");
        }
                

        const profile = await this.repository.findProfileByEmail(signupRequest.email);
        if(profile.length > 0){
            throw new Error(`Profile existes with email: ${signupRequest.email}`);
        }

        let stripeOnboardUrl : any;
        if(signupRequest.isBusinessOwner){
            stripeOnboardUrl = await this.registerStripeAccount(signupRequest);
        }

        const encryptedPassword = await bcrypt.hash(signupRequest.password, 10);
        const newProfile = new Profile({
            firstName: signupRequest.firstName,
            lastName: signupRequest.lastName,
            email: signupRequest.email,
            password: encryptedPassword,
            isBusinessOwner: signupRequest.isBusinessOwner,
            isStripeOnboarded: false
        });
        

        const saveProfile = await this.repository.saveProfile(newProfile);     

        return {
            profile: saveProfile,
            stripeSetUpUrl: stripeOnboardUrl
        }

   }

   

   async retreieveByEmail(email: string) : Promise<any>{
        return await this.repository.findProfileByEmail(email);
   }

   async registerStripeAccount(signupRequest : SignupRequest){
        const account = await stripe.accounts.create({
            type: 'standard',
        });

        const accountLink = await stripe.accountLinks.create({
            type: "account_onboarding",
            account: account.id,
            refresh_url: signupRequest.redirectUrl,
            return_url: signupRequest.redirectUrl,
        });

        return accountLink.url;
    }

}