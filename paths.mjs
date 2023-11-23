import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set rootDir as the root directory of the project
export const rootDir = join(__dirname);
export const configDir = join(__dirname, 'config');
