import { MongoClient } from "mongodb";
import { CollectionDoc, DBService, UserDoc } from "./db.service"
import clientPromise from "./mongodb"
// import discord from "./discord";

import { TheBlockChainApi,Needed } from "./theblockchainapi.service"
import { SnowTransfer } from "snowtransfer";
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
        let owned:CollectionDoc[] = []
        
        guild.forEach(collection => {
            const nft = nfts.find(nft => nft.update_authority === collection.update_authority)
            // if(!nft) throw new Error("nft not found")
            // if( !== user.wallet_address) throw new Error("nft not owned by user")
            if (nft){

                owned.push(collection)
            }
        })
        for (const c of owned) {
            await GiveRole(userid,c.guild_id,c.role_id)
        }
        

        console.log(owned)
        return owned.length>0
    }
}
async function GiveRole(userid:string,guildid:string,roleid:string){
    const client = new SnowTransfer(process.env.BOT_TOKEN || "",);
    await client.guild.addGuildMemberRole(guildid,userid,roleid)
}