import path from 'node:path';
import { fileURLToPath } from 'node:url';

class FileMan {
    getFileName(metaURL) {
        return fileURLToPath(metaURL);
    }
    getDirName(metaURL){
        return path.dirname(fileURLToPath(metaURL));
    }
}
export default new FileMan();
