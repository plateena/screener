import yargs from 'yargs';
import fs from 'fs';
import { join } from 'path';
import { configDir } from '../paths.mjs';
import updateStockListings from './update-listings.mjs';

// Load configuration
const configPath = join(configDir, 'config.json');
try {
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configData);

    // Validate the configuration format
    if (!config || !config.watchlist) {
        console.error('Invalid configuration format');
        process.exit(1);
    }

    console.log('Loaded configuration:', config);

    // Set up yargs for command-line arguments
    yargs(process.argv.slice(2))
        .command('update-listings', 'Update stock listings', {}, (argv) => {
            // Call the updateStockListings function when the 'update-listings' command is provided
            updateStockListings(config.watchlist);

            // Update the configuration file with the modified watchlist
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
        })
        .help()
        .argv;

    // Access the watchlist
    console.log('Current Watchlist:', config.watchlist);
} catch (error) {
    console.error('Error loading configuration:', error.message);
    process.exit(1);
}
