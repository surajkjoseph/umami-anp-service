import { Request, Response } from 'express';
import { SignupRequest } from "../dto/request/signup-request";
import { BaseHttpController, controller, httpPost, request, response } from "inversify-express-utils";
import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { SignonService } from '../service/signon-service';

@controller("/account")
export class SignonController extends BaseHttpController {

    constructor(@inject(TYPES.SignonService) private service : SignonService)
    { super();}

    @httpPost('/register')
    async signup(@request() req: Request, @response() res: Response)  {
        try{
            console.log("Starting registering");
            res.status(201).json(await this.service.register(req.body));
            console.log("Completed registering");
        }catch(e: any){
            console.error("Error Occurred", e);
            res.status(500).json({ message: 'Error registering', description: e.message });
        }
        
    }

    @httpPost('/retrieveByEmail')
    async retreiveByEmail(@request() req: Request, @response() res: Response)  {
        try {
            res.json(await this.service.retreieveByEmail(req.body['email'])).status(200);
        } catch (error : any) {
            console.error("Error Occurred", error);
            res.status(500).json({ message: 'Error fetching', description: error.message });
        } 
    }

}