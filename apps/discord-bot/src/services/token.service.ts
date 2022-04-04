import jwt from "jsonwebtoken";
const KEY = "kfdsgjebjgbvsdfjglhbjgbvsjdfg"
class TokenService {
    static getToken(userid: string,username:string,guildid:string): string {
        return jwt.sign({ userid ,username,guildid}, KEY,{expiresIn:"5m"});
    }
    
}
export { TokenService };