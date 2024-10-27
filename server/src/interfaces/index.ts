export interface JWTUSER{
    id:string;
    email:string;
}

export interface GraphqlContext{
    user?:JWTUSER
}