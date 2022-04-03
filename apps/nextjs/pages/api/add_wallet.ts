import type { NextApiRequest, NextApiResponse } from "next";

import mongoClient from "../../lib/mongodb";
import { MongoClient, Db } from "mongodb";

import jwt from "jsonwebtoken";
const key = "kfdsgjebjgbvsdfjglhbjgbvsjdfg";
type encodePayload = {
	userid: string;
	username: string;
};
type User = {
	userid: string;
	wallet_address: string;
};
class Service {
	mongoClient: MongoClient;
	db: Db;
	constructor(mongoClient: MongoClient) {
		this.mongoClient = mongoClient;
		this.db = mongoClient.db("nft-verify");
	}
	async addWallet(userid: string, wallet_address: string) {
		return this.db.collection("users").updateOne(
			{ userid },
			{
				$set: { userid, wallet_address },
			},
			{ upsert: true }
		);
	}
}

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
		const { userid, username } = decoded as encodePayload;
		console.log(decoded);
		const service = new Service((await mongoClient) as MongoClient);
		service.addWallet(userid, req.body.wallet_address);
		res.status(200).json(decoded);
	} catch (e) {
		res.status(400).json({ message: "invalid token" });
	}
}
