import type { NextApiRequest, NextApiResponse } from "next";
const key = "kfdsgjebjgbvsdfjglhbjgbvsjdfg";
import jwt from "jsonwebtoken";
type encodePayload = {
	userid: string;
	username: string;
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
		const { userid, username } = decoded as encodePayload;
		console.log(decoded);
		res.status(200).json(decoded);
	} catch (e) {
		res.status(400).json({ message: "invalid token" });
	}
}
