import { MongoClient, Db, WithoutId, WithId } from "mongodb";
type Collection = {
	guild_id: string;
	symbol: string;
	update_authority: string;
	log_channel_id: string;
	role_id: string;
};
type CollectionDoc = WithId<Collection>;
class DBService {
	public client: MongoClient;
	db: Db;
	constructor(client: MongoClient) {
		this.client = client;
		this.db = this.client.db("nft-verify");
	}
	public async getCollectionsByGuild(
		guild_id: string
	): Promise<CollectionDoc[]> {
		const collections = await this.db
			.collection("collections")
			.find({ guild_id: guild_id })
			.toArray();
		const collection_list = collections as CollectionDoc[];
		return collection_list;
	}
	public async addCollection(collection: Collection): Promise<void> {
		await this.db.collection("collections").insertOne(collection);
	}
	public async getUserByDiscordId(userid: string): Promise<UserDoc | null> {
		const user = await this.db
			.collection("users")
			.findOne({ userid: userid });
		const user_without_id = user as UserDoc | null;
		return user_without_id;
	}
	async addWallet(userid: string, wallet_address: string) {
		return this.db.collection("users").updateOne(
			{ userid },
			{
				$set: { userid, wallet_address },
			},
			{ upsert: true }
		);
	}
	async getWallet(userid: string):Promise<UserDoc | null> {
		return await this.db.collection("users").findOne({ userid }) as UserDoc | null;
	}
}
type User = {
	userid: string;
	wallet_address: string;
};
type UserDoc = WithId<User>;

export { DBService };	export type { User, UserDoc ,Collection,CollectionDoc};

