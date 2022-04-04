// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { SnowTransfer } from 'snowtransfer';
type Data = {
    name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    const client = new SnowTransfer(process.env.BOT_TOKEN || "",);
    await client.guild.addGuildMemberRole("954398254236315688","705463601011490907","960453761145397288")
    res.status(200).json({ name: 'Done' });
}
