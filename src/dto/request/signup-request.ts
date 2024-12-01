
export interface SignupRequest {
    firstName: string;
    lastName: string;
    email : string;
    password : string;
    redirectUrl? : string;    
    isBusinessOwner? : boolean;
}