import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { SignupRequest } from "../dto/request/signup-request";
import Profile from "../entity/profile";
import { TYPES } from "../config/types";
import { ProfileRepository } from "../repository/profile-repository";
import { default as bcrypt } from 'bcryptjs'
import { SigninRequest } from "../dto/request/signin-request";
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51QMAmWHDjSLebidMafJsExxIgjXsNnEi0z3Kr4XFb8MeT5eqWETiLjXf2peHJW1YvkCqEIl6kSMsSGPAtfmJt95K00Z6P7mcrS");
const jwtSecret = process.env.JWT_SECRET || 'your_secret_key';

@injectable()
export class SignonService{

    constructor(
        @inject(TYPES.ProfileRepository) private repository : ProfileRepository
    ){}

    async authorize(token : string) : Promise<any>{
        try {
            console.log(token);
            const decoded = jwt.verify(token, jwtSecret);
            return decoded;
          } catch (error) {
            throw new TypeError ('Invalid or expired token' );
          }
    }

    async signin(signinRequest : SigninRequest) : Promise<any>{

        if(!signinRequest.email || !signinRequest.password){
            throw new Error ("Email and Password is mandatory");
        }

        let profile = await this.repository.findProfileByEmail(signinRequest.email);
        profile = profile[0];
        if(!profile){
            throw new Error(`Profile doesnot existes with email: ${signinRequest.email}`);
        }
      
        const isPasswordValid = await bcrypt.compare(signinRequest.password, profile.password);
        if (!isPasswordValid) {
          throw new TypeError ('Invalid credentials' );
        }

        const token = jwt.sign({ accountId: profile._id, firstName: profile.firstName, lastName: profile.lastName, email: profile.email, isBusinessOwner: profile.isBusinessOwner }, jwtSecret, { expiresIn: '1h' });
        return {profile: profile, token: token};
    }

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