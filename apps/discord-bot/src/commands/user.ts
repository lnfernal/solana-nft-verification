import {
	CommandInteraction,
	MessageActionRow,
	MessageButton,
} from "discord.js";
import { Discord, Slash } from "discordx";
import { DBService } from "../services/db.service.js";
import mongo from "../utils/db.js";
import { showError } from "../utils/showError.js";
import { TokenService } from "../services/token.service.js";
import { TheBlockChainApi } from "../services/theblockchainapi.service.js";
const db = new DBService(await mongo);
const BApi = new TheBlockChainApi(
	process.env.API_KEY_ID || "",
	process.env.API_KEY_SECRET || ""
);

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
		console.log(userdoc,user.id,typeof user.id)
		if (userdoc) {
			await interaction.editReply(
				`Your account has wallet address ${userdoc.wallet_address}`
			);
			//get nft's 
			const nfts = await BApi.solanaGetNFTsBelongingToWallet({wallet:userdoc.wallet_address,network:"devnet"});
			console.log(nfts)
			return
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
