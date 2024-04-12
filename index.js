require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const mcs = require('node-mcstatus')

const {
  DISCORD_BOT_TOKEN,
  MC_SERVER_ADDRESS,
  MC_SERVER_PORT
} = process.env;

const options = {
    query: true
}

async function checkServerStatus() {
    return new Promise((resolve, reject) => {
        mcs.statusJava(MC_SERVER_ADDRESS, MC_SERVER_PORT, options)
        .then((result) => {
            console.log(result)
            if (!result.online) resolve(false)
            resolve(true)
        })
        .catch((err) => {
            console.log(err)
            resolve(false)
        })
    })
}

function updateBotStatus(serverOnline) {
    if (serverOnline) {
        client.user.setStatus('online');
        client.user.setActivity('Server: Online', { type: 'WATCHING' });
    } else {
        client.user.setStatus('dnd');
        client.user.setActivity('Server: Offline', { type: 'WATCHING' });
        
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
    }, 2000000) // 20 minutes 
});

client.login(DISCORD_BOT_TOKEN)