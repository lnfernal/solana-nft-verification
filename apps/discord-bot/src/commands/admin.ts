import { CommandInteraction, MessageEmbed, Role } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { Collection, DBService } from "../services/db.service.js";
import mongo from "../utils/db.js"
import { showError } from "../utils/showError.js";
const db = new DBService(await mongo);


@Discord()
export abstract class Admin {
	
		
	@Slash("ping")
	async ping(interaction: CommandInteraction): Promise<void> {
		interaction.reply("pong!");
	}
	@Slash("add_collection")
	async addCollection(
		@SlashOption("symbol")
		symbol: string,
		@SlashOption("update_authority")
		updateAuthority: string,
		@SlashOption("creator_address")
		creatorAddress: string,
		@SlashOption("role",{type:"ROLE"})
		role:Role,
		interaction: CommandInteraction
	): Promise<void> {
		const guild_id = interaction.guildId;
		if (!guild_id){
			showError("No guild id", interaction);
			return;
		}
		
		const collection:Collection = {
			guild_id,
			symbol,
			update_authority: updateAuthority,
			creator_address: creatorAddress,
			role_id: role.id
		};
		await db.addCollection(collection);
		interaction.reply(
			`Added collection ${symbol} with authority ${updateAuthority} and creator ${creatorAddress} for guild ${guild_id} for role ${role.name}`
		);
	}
	@Slash("list_collections")
	async listCollections(interaction: CommandInteraction): Promise<void> {
		const guild_id = interaction.guildId;
		if (!guild_id){
			showError("No guild id", interaction);
			return;
		}
		const collections = await db.getCollectionsByGuild(guild_id);
		const embed = new MessageEmbed({
			title: "Collections",
			color: "#DE1738",
		});
		collections.forEach((collection,i) => {
			const role = `<@&${collection.role_id}>`;
			embed.addField(
				`${i+1}. ${collection.symbol}`,
				`Role - ${role}\nUpdate Authority: ${collection.update_authority}\nCreator Address: ${collection.creator_address}`
			);
		});
		if (collections.length === 0) {
			embed.addField("No collections", "Add a collection with `/add_collection`");
		}
			
		interaction.reply({ embeds: [embed] });
	}
}
