import {
	CommandInteraction,
	MessageActionRow,
	MessageButton,
} from "discord.js";
import { Discord, Slash } from "discordx";
import { UserDBService } from "../lib/db.service.js";
import mongo from "../lib/db.js";
import { showError } from "../utils/showError.js";
import { TokenService } from "../lib/token.service.js";
const db = new UserDBService(await mongo);

@Discord()
export abstract class UserCommands {
	@Slash("verify")
	async verify(interaction: CommandInteraction): Promise<void> {
		await interaction.deferReply();
		const user = interaction.member?.user;
		if (!user) {
			showError("No user", interaction);
			return;
		}
		const userdoc = await db.getUserByDiscordId(user.id);
		if (userdoc) {
			interaction.editReply(
				`Your account has wallet address ${userdoc.wallet_address}`
			);
		} else {
			// send button to get wallet address
			const button = new MessageButton({
				label: "Connect Wallet",
				style: "LINK",
				url: "https://solana-nft-verification.vercel.app/"+`?token=${TokenService.getToken(user.id,user.username)}`,
			});
			// Create a MessageActionRow and add the button to that row.
			const row = new MessageActionRow().addComponents(button);

			interaction.editReply({
				content: "Your account has no wallet Connected. Please click the button below to Connect.",
				components: [row],
			});
		}


	}
}
