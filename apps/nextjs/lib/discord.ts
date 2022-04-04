import {SnowTransfer} from 'snowtransfer';

const client = new SnowTransfer(process.env.BOT_TOKEN || "",);

export default client