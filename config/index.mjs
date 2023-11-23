import fs from 'fs';
import { rootDir } from '../paths.mjs';

let config = loadConfig();

function loadConfig() {
    try {
        const configData = fs.readFileSync(`${rootDir}/config/config.json`, 'utf-8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('Error loading config:', error.message);
        return {};
    }
}

function saveConfig() {
    try {
        fs.writeFileSync(`${rootDir}/config/config.json`, JSON.stringify(config, null, 2), 'utf-8');
        console.log('Config saved successfully!');
    } catch (error) {
        console.error('Error saving config:', error.message);
    }
}

function updateWatchlist(newWatchlist) {
    config.watchlist = newWatchlist;
    saveConfig();
}

export { config, updateWatchlist };
