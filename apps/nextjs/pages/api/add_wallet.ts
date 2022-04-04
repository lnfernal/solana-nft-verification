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
		const { userid, username,guildid } = decoded as encodePayload;
		console.log(decoded);
		const service = new DBService((await mongoClient) as MongoClient);
		await service.addWallet(userid, req.body.wallet_address);
		const verify = new Verify(service);
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
			} else {
				res.status(400).json({
					message: "no nfts owned",
				});
			}
		} catch (error) {
			res.status(418).json({message:"error verifying"})
			return
		}
		res.status(200).json(decoded);
	} catch (e) {
		res.status(400).json({ message: "invalid token" });
	}
}
