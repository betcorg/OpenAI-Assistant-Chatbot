
class Database {

  constructor(provider, uri) {
    this.provider = provider;
    this.uri = uri;
  }

  async connect() {
    await this.provider.connect(this.uri);
  }
}

export default Database;