import { promises as fsPromises } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const commandsPath = './commands';

const importCommands = async () => {
    const commandFiles = await fsPromises.readdir(commandsPath);

    return Promise.all(
        commandFiles
            .filter(file => file.endsWith('.js'))
            .map(async (file) => {
                const module = await import(join(__dirname, commandsPath, file));
                return module.default;
            })
    );
};

export const initializeHandlers = async () => {
    const handlers = await importCommands();

    handlers.forEach(handler => {
        // Extract command name from handler function name
        const commandName = handler.name.replace(/Handler$/, '').toLowerCase();
        // Register command handler using commander
        let args = process.argv
        args.splice(0, 2);
        const command = args.splice(0, 1)
        if (command == commandName) {
            handler(...args); // Call the handler function
        }
    });
};
