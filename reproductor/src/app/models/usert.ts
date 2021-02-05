export class User {


       
    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        public email: string,
        public password: string,
        public role: string,
        public image: string,
        public gethash? : any,
        public user? : User,
        public token? : string,
        public message? : string | undefined,
        public status? : number

    ) { }
    

    

   
}