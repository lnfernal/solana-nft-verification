import { MongoClient } from "mongodb";
import { DBService, UserDoc } from "./db.service"
import clientPromise from "./mongodb"
import { TheBlockChainApi,Needed } from "./theblockchainapi.service"
const BApi = new TheBlockChainApi(
	process.env.API_KEY_ID || "",
	process.env.API_KEY_SECRET || ""
);
export class Verify {
    service : DBService
    constructor (s:DBService) {
        this.service = s;
    }
    async verify(userid:string,guildid:string){
        const service = this.service
        if(!service) throw new Error("mongodb client not ready")
        const user:UserDoc|null = await service.getWallet(userid)
        if(!user) throw new Error("user not found")
        const guild = await service.getCollectionsByGuild(guildid)
        if(!guild) throw new Error("guild not found")
        const nfts= await BApi.solanaGetNFTsBelongingToWallet({wallet:user.wallet_address,network:"mainnet-beta"})
        let owned:Needed[] = []
        guild.forEach(collection => {
            const nft = nfts.find(nft => nft.update_authority === collection.update_authority)
            if(!nft) throw new Error("nft not found")
            // if( !== user.wallet_address) throw new Error("nft not owned by user")
            owned.push(nft)
        })
        console.log(owned)
        return owned.length>0
    }
}