
class DatabaseProvider {

    constructor(provider) {
        this.provider = provider;
    }

    async connect() {
        await this.provider.connect();
    }
}

export default DatabaseProvider;