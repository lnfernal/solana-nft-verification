import jwt from "jsonwebtoken";
const KEY = "kfdsgjebjgbvsdfjglhbjgbvsjdfg"
class TokenService {
    static getToken(userid: string,username:string): string {
        return jwt.sign({ userid ,username}, KEY,{expiresIn:"5m"});
    }
    
}
export { TokenService };