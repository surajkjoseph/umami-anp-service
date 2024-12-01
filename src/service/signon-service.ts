import { injectable } from "inversify";
import Stripe from "stripe";
import { SignupRequest } from "../dto/request/signup-request";

const stripe = new Stripe("sk_test_51QMAmWHDjSLebidMafJsExxIgjXsNnEi0z3Kr4XFb8MeT5eqWETiLjXf2peHJW1YvkCqEIl6kSMsSGPAtfmJt95K00Z6P7mcrS");

@injectable()
export class SignonService{

   async register(signupRequest : SignupRequest) : Promise<any> {
        let stripeOnboardUrl : any;
        if(signupRequest.isBusinessOwner){
            stripeOnboardUrl = await this.registerStripeAccount(signupRequest);
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