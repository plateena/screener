import { promises as fsPromises, readdirSync } from 'fs';
import { join } from 'path';
import { program } from 'commander'; // assuming you're using commander

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
        program.command(commandName).action(() => {
            handler(); // Call the handler function
        });
    });

    program.parse(process.argv);
};
