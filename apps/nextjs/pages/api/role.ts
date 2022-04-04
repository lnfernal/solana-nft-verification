// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import discord from "../../lib/discord"
type Data = {
    name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
     discord.guild.addGuildMemberRole("954398254236315688","705463601011490907","960453761145397288")
    res.status(200).json({ name: 'Done' });
}
