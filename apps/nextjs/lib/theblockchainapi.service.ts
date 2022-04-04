import {Error} from "../types"
import { OffChainData, Root } from "../types";
import fetch from 'node-fetch';

export type Needed={
	symbol:string,
	update_authority:string,
	creator_address:string
}
function metaDataToNeeded(data:Root):Needed[]{
	
	return  data.nfts_metadata.map(d=>{
		return {
			symbol:d.data.symbol,
			update_authority:d.update_authority,
			creator_address:d.off_chain_data.properties?.creators[0].address ||""
		}
	})
}
export class TheBlockChainApi {
	keyid: string;
	keysecret: string;

	constructor(keyid: string, keysecret: string) {
		this.keyid = keyid;
		this.keysecret = keysecret;
	}
	async solanaGetNFTsBelongingToWallet({
		wallet,
		network = "mainnet-beta",
	}: {
		wallet: string;
		network: string;
	}): Promise<Needed[]> {

		const url =
			`https://api.blockchainapi.com/v1/solana/wallet/${network}/${wallet}/nfts`;
			console.log(this)
		const response = await fetch(url, {
            method: 'GET',
            headers: {APIKeyID: this.keyid, APISecretKey: this.keysecret}
          });
        const json = await response.json() as any;
        console.log(json);
        if (json.error_message){
            throw new Error(json.error_message);
             
        }
        const data = json as Root;
		console.log(data)
        return metaDataToNeeded(data);
	}
}