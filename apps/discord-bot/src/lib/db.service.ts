import { MongoClient,Db, WithoutId, WithId } from "mongodb";
type Collection ={ 
    guild_id: string,
    symbol: string,
    update_authority: string,
    creator_address: string,
    role_id: string,
}
 type CollectionDoc  = WithId<Collection>
class AdminDBService {
	public client: MongoClient;
    db: Db;
	constructor(client: MongoClient) {
		this.client = client;
        this.db = this.client.db("nft-verify");
	}
    public async getCollectionsByGuild(guild_id: string): Promise<CollectionDoc[]> {
        const collections = await this.db.collection("collections").find({guild_id: guild_id}).toArray();
        const collection_list = collections as CollectionDoc[];
        return collection_list;
    }
    public async addCollection(collection: Collection): Promise<void> {
        await this.db.collection("collections").insertOne(collection);
    }
}
type User = {
    id: string,
    username: string,
    wallet_address: string,
    verifiedCollections: Collection[]
}
type UserDoc = WithId<User>
class UserDBService {
    client: MongoClient;
    db: Db;
    constructor(client: MongoClient) {
        this.client = client;
        this.db = this.client.db("nft-verify");
    }
    public async getUserByDiscordId(user_id: string): Promise<UserDoc|null> {
        const user = await this.db.collection("users").findOne({user_id: user_id});
        const user_without_id = user as UserDoc | null;
        return user_without_id;
    }
}
export { AdminDBService ,Collection,CollectionDoc,UserDBService  };
