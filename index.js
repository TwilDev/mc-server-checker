require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const { exec } = require('child_process')

const {
  DISCORD_BOT_TOKEN,
  MC_SERVER_ADDRESS,
} = process.env;

async function checkServerStatus() {
    return new Promise((resolve, reject) => {
        exec(`ping -n 3 ${MC_SERVER_ADDRESS}`, (error, stdout, stderr) => {
            if (error) {
                console.log(error)
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
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
    }, 10000); // Check every 5 minutes (adjust as needed)
});

client.login(DISCORD_BOT_TOKEN)