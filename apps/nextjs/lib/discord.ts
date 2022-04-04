import {SnowTransfer} from 'snowtransfer';

const client = new SnowTransfer(process.env.API_KEY_ID || "");

export default client