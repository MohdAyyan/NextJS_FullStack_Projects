declare module "next-auth"{

    interface Session{
        user:{
            id:string;
        } & DefaultSession["user"];
    }


}
// yea file same he rahenge har waqt 