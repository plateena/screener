import yargs from 'yargs';
import fs from 'fs';
import { configDir } from '../paths.mjs';
import { join } from 'path';
import updateStockListings from './update-listing.mjs';

// Load configuration
const configPath = join(configDir, 'config.json');
const configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData);

// Set up yargs for command-line arguments
const argv = yargs(process.argv.slice(2))
    .command('update-listings', 'Update stock listings', {}, (argv) => {
        // Call the updateStockListings function when the 'update-listings' command is provided
        updateStockListings(config.watchlist);
    })
    .help()
    .argv;

