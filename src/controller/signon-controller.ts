import { Request, Response } from 'express';
import { SignupRequest } from "../dto/request/signup-request";
import { BaseHttpController, controller, httpPost, request, response } from "inversify-express-utils";
import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { SignonService } from '../service/signon-service';

@controller("/signon")
export class SignonController extends BaseHttpController {

    constructor(@inject(TYPES.SignonService) private service : SignonService)
    { super();}

    @httpPost('/register')
    async signup(@request() req: Request, @response() res: Response)  {
        res.json(await this.service.register(req.body, req.headers.origin)).status(200);
    }

}