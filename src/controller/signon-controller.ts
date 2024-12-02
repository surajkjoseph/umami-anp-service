import { Request, Response } from 'express';
import { SignupRequest } from "../dto/request/signup-request";
import { BaseHttpController, controller, httpGet, httpPost, queryParam, request, requestParam, response } from "inversify-express-utils";
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
            res.status(201).json(await this.service.register(req.body));
        }catch(e: any){
            console.error("Error Occurred", e);
            res.status(500).json({ message: 'Error registering', description: e.message });
        }
        
    }

    @httpGet("/session/validate")
    async validateSession(@queryParam() queryParam: any, @response() res: Response)  {
        try{
            res.status(200).json(await this.service.authorize(queryParam['token']));
        }catch(e: any){
            console.error("Error Occurred", e);
            if(e instanceof TypeError){
                res.status(401).json({ message: 'Un-Authorized', description: e.message });
            }else{
                res.status(500).json({ message: 'Error Validate Session', description: e.message });
            }
           
        }
    }

    @httpPost("/signin")
    async signin(@request() req: Request, @response() res: Response)  {
        try{
            res.status(200).json(await this.service.signin(req.body));
        }catch(e: any){
            console.error("Error Occurred", e);
            if(e instanceof TypeError){
                res.status(401).json({ message: 'Un-Authorized', description: e.message });
            }else{
                res.status(500).json({ message: 'Error Signin', description: e.message });
            }
           
        }
    }

    @httpPost('/findByEmail')
    async retreiveByEmail(@request() req: Request, @response() res: Response)  {
        try {
            res.json(await this.service.retreieveByEmail(req.body['email'])).status(200);
        } catch (error : any) {
            console.error("Error Occurred", error);
            res.status(500).json({ message: 'Error fetching', description: error.message });
        } 
    }

    @httpGet("/findById")
    async retreiveById(@requestParam() id: string, @response() res: Response)  {
    }


}