require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const util = require('minecraft-server-util')

const {
  DISCORD_BOT_TOKEN,
  MC_SERVER_ADDRESS
} = process.env;

async function checkServerStatus() {
  return new Promise((resolve, reject) => {
    util.status(MC_SERVER_ADDRESS)
    .then(() => resolve(true))
    .catch(() => resolve(false));
});
}

function updateBotStatus(serverOnline) {
    if (serverOnline) {
        client.user.setStatus('online');
        client.user.setActivity('Server: Online', { type: 'WATCHING' });
    } else {
        client.user.setActivity('Server: Offline', { type: 'WATCHING' });
        client.user.setStatus('dnd');
    }
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // Check server status initially when bot starts
    const isOnline = await checkServerStatus();
    console.log(isOnline)
    updateBotStatus(isOnline);
    // Schedule periodic server checks
    setInterval(async () => {
        const isOnline = await checkServerStatus()
        console.log(isOnline)
        updateBotStatus(isOnline);
    }, 1000) // 10 seconds
});

client.login(DISCORD_BOT_TOKEN)