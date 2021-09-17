import {
  Collection,
  CreateIndexesOptions,
  Db,
  MongoClient,
  MongoClientOptions,
} from "mongodb";

export class MongoDB {
  private db: Db;
  private client: MongoClient;

  public constructor(
    private connectionString: string,
    private databaseName: string
  ) {}

  public async connect() {
    const options: MongoClientOptions = {
      sslValidate: true,
      keepAlive: true,
      keepAliveInitialDelay: 1000,
      connectTimeoutMS: 1000,
    };

    this.client = await MongoClient.connect(this.connectionString, options);
    this.db = this.client.db(this.databaseName);
  }

  public async createCollection<T>(
    collectionName: string
  ): Promise<Collection<T>> {
    return await this.db.createCollection<T>(collectionName);
  }

  public async dropCollection(collectionName: string): Promise<void> {
    await this.db.dropCollection(collectionName);
  }

  public async ensureCollection<T>(
    collectionName: string
  ): Promise<Collection<T>> {
    const collections = await this.db
      .listCollections({ name: collectionName })
      .toArray();

    const collection = collections.length
      ? (this.db.collection(collectionName) as Collection<T>)
      : await this.createCollection<T>(collectionName);

    return collection;
  }

  public async ensureIndex(
    collectionName: string,
    fieldOrSpec: any,
    options?: CreateIndexesOptions
  ): Promise<string> {
    const collection = await this.ensureCollection(collectionName);
    const ensured = await collection.createIndex(fieldOrSpec, options);
    return ensured;
  }

  public async getCollection<T>(
    collectionName: string
  ): Promise<Collection<T>> {
    return this.ensureCollection<T>(collectionName);
  }
}
