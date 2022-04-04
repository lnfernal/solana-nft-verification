import Discord from "discord.js"
const client = new Discord.Client({
	intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGES]
}); // 
export default client;
client.login(process.env.BOT_TOKEN);
client.on("ready", () => {
    console.log("Bot ready");
}
);