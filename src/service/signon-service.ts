import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { SignupRequest } from "../dto/request/signup-request";
import Profile from "../entity/profile";
import mongoose from "mongoose";
import { TYPES } from "../config/types";
import { ProfileRepository } from "../repository/profile-repository";

const stripe = new Stripe("sk_test_51QMAmWHDjSLebidMafJsExxIgjXsNnEi0z3Kr4XFb8MeT5eqWETiLjXf2peHJW1YvkCqEIl6kSMsSGPAtfmJt95K00Z6P7mcrS");

@injectable()
export class SignonService{

    constructor(
        @inject(TYPES.ProfileRepository) private repository : ProfileRepository
    ){}

    async register(signupRequest : SignupRequest) : Promise<any> {

        if(!signupRequest.email || !signupRequest.password)
                throw new Error ("Email and Password is mandatory");

        const profile = await this.repository.findProfileByEmail(signupRequest.email);
        if(profile){
            throw new Error(`Profile existes with email: ${signupRequest.email}`);
        }

        const newProfile = new Profile({
            email: signupRequest.email,
            password: signupRequest.password,
            isBusinessOwner: signupRequest.isBusinessOwner
        });

        const saveProfile = await this.repository.saveProfile(newProfile);
            
        let stripeOnboardUrl : any;
        if(signupRequest.isBusinessOwner){
            stripeOnboardUrl = await this.registerStripeAccount(signupRequest);
        }

        return {
            profile: saveProfile,
            stripeSetUpUrl: stripeOnboardUrl
        }

        

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