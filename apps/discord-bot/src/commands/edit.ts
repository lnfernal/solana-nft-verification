import { CommandInteraction, Role } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import mongo from "../utils/db.js"
import { showError } from "../utils/showError.js";
const db = (await mongo).db("nft-verify");
@Discord()
@SlashGroup({"name":"edit","description":"Edit collections"})
@SlashGroup("edit")
export abstract class Commands {
    @Slash("symbol")
    async editSymbol(
        @SlashOption("symbol")
        symbol: string,
        interaction: CommandInteraction
    ): Promise<void> {
        const guild_id = interaction.guildId;
        if (!guild_id) {
            showError("No guild id", interaction);
            return;
        }
        const collections = await db.collection("collections").find({guild_id: guild_id}).toArray();
        if (collections.length === 0) {
            showError("No collection found for this guild\nFirst Add Collection to server by running /add_collection", interaction);
            return;
        }
        const collection = collections[0];
        collection.symbol = symbol;
        await db.collection("collections").updateOne({_id: collection._id}, {$set: collection});
        interaction.reply(`Updated collection\nSymbol to ${collection.symbol}`);
    }
    @SlashGroup("edit")
    @Slash("update_authority")
    async editUpdateAuthority(
        @SlashOption("update_authority")
        updateAuthority: string,
        interaction: CommandInteraction
    ): Promise<void> {
        const guild_id = interaction.guildId;
        if (!guild_id) {
            showError("No guild id", interaction);
            return;
        }
        const collections = await db.collection("collections").find({guild_id: guild_id}).toArray();
        if (collections.length === 0) {
            showError("No collection found for this guild\nFirst Add Collection to server by running /add_collection", interaction);
            return;
        }
        const collection = collections[0];
        collection.update_authority = updateAuthority;
        await db.collection("collections").updateOne({_id: collection._id}, {$set: collection});
        interaction.reply(`Updated collection\nUpdate Authority to ${collection.update_authority}`);
    }
    @SlashGroup("edit")
    @Slash("creator_address")
    async editCreatorAddress(
        @SlashOption("creator_address")
        creatorAddress: string,
        interaction: CommandInteraction
    ): Promise<void> {
        const guild_id = interaction.guildId;
        if (!guild_id) {
            showError("No guild id", interaction);
            return;
        }
        const collections = await db.collection("collections").find({guild_id: guild_id}).toArray();
        if (collections.length === 0) {
            showError("No collection found for this guild\nFirst Add Collection to server by running /add_collection", interaction);
            return;
        }
        const collection = collections[0];
        collection.creator_address = creatorAddress;
        await db.collection("collections").updateOne({_id: collection._id}, {$set: collection});
        interaction.reply(`Updated collection\nCreator Address to ${collection.creator_address}`);
    }
    @SlashGroup("edit")
    @Slash("role")
    async editRoleId(
        @SlashOption("role",{type:"ROLE"})
		role:Role,
        interaction: CommandInteraction
    ): Promise<void> {
        await interaction.deferReply();
        const roleId = role.id; 
        const guild_id = interaction.guildId;
        if (!guild_id) {
            showError("No guild id", interaction);
            return;
        }
        const collections = await db.collection("collections").find({guild_id: guild_id}).toArray();
        if (collections.length === 0) {
            showError("No collection found for this guild\nFirst Add Collection to server by running /add_collection", interaction);
            return;
        }
        const collection = collections[0];
        const old_role_id = collection.role_id;
        collection.role_id = roleId;
        await db.collection("collections").updateOne({_id: collection._id}, {$set: collection});
        await interaction.editReply(`Updated collection\nRole to <@&${collection.role_id}>`);
        //remove role for member with role
        const old_role = await interaction.guild?.roles.fetch(old_role_id)
        if (old_role){
            for (const m of old_role.members){
                await m[1].roles.remove(old_role);
                
                await interaction.followUp(`Role <@&${old_role_id}> removed from <@${m[1].id}>`);
                await m[1].roles.add(role);
                // await m[1].send(`You have been added to the role <@&${roleId}>`);
                await interaction.followUp(`Role <@&${roleId}> added to <@${m[1].id}>`);
            }
        }
    }
}