import type { NextApiRequest, NextApiResponse } from "next";

import mongoClient from "../../lib/mongodb";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import { DBService } from "../../lib/db.service";
import { Verify } from "../../lib/verify";
const key = "kfdsgjebjgbvsdfjglhbjgbvsjdfg";
type encodePayload = {
	userid: string;
	username: string;
	guildid:string;
	exp:number
};
type User = {
	userid: string;
	wallet_address: string;
};


export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { token, wallet_address } = req.body;
	if (!token || !wallet_address) {
		res.status(400).json({
			message: "invalid request",
		});
		return;
	}
	try {
		const decoded = jwt.verify(token, key);
		const { userid, username,guildid ,exp} = decoded as encodePayload;
		console.log(decoded);
		if (new Date().getTime()>exp*1000) {
			res.status(400).json({ message: "token expired" });
			return;
		}
		const service = new DBService((await mongoClient) as MongoClient);
		const verify = new Verify(service);
		await service.addWallet(userid, req.body.wallet_address);
		const data =(await service.getCollectionsByGuild(guildid))[0]
		let doesOwn = false;
		try {
			
			doesOwn = await verify.verify(userid,guildid)
			if (doesOwn) {
				res.status(200).json({
					message: "verified",
					userid,
					username,
					wallet_address,
				});
				return 
			} else {
				res.status(400).json({
					message: "no nfts owned",
					symbol:data.symbol
				});
				return
			}
		} catch (error) {
			console.log(error)
			res.status(418).json({message:"error verifying",symbol:data.symbol})
			return
		}
		res.status(200).json(decoded);
	} catch (e) {
		res.status(400).json({ message: "invalid token" });
		return
	}
}
