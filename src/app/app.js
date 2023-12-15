import { program } from 'commander';
// import { handleCommand } from './commandHandler';

program
    .version('1.0.0') // Set the version number

// Define the "status" command
program
    .command('status <CODE>')
    .description('Handle a status code')
    .action((code) => {
        // handleCommand('status', code);
    });

// Parse command line arguments
program.parse(process.argv);

// If no command is provided, default to the "help" command
if (!process.argv.slice(2).length) {
    program.outputHelp();
}