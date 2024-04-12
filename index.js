require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const mcs = require('node-mcstatus')
const express = require('express')

const {
  DISCORD_BOT_TOKEN,
  MC_SERVER_ADDRESS,
  MC_SERVER_PORT,
  CHANNEL_ID,
} = process.env;

const options = {
    query: true
}

const app = express()
const PORT = process.env.PORT || 4000

let currentServerStatus = false // assume server is offline initially

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
        client.user.setStatus('online')
        client.user.setActivity('Server: Online')
    } else {
        client.user.setStatus('dnd')
        client.user.setActivity('Server: Offline')
        
    }
}

function checkForStatusChange(serverOnline) {
    if (currentServerStatus !== serverOnline) {
        currentServerStatus = serverOnline
        addNewChatOnStatusChange(serverOnline)
    }
}

function addNewChatOnStatusChange(serverOnline) {
    const getTime = new Date().toLocaleTimeString()
    const channel = client.channels.cache.get(CHANNEL_ID)
    if (serverOnline) {
        channel.send(`Server is now up boiiiii: ${getTime}`)
    } else {
        channel.send(`Server has gone night night: ${getTime}`)
    }
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    
    // Check server status initially when bot starts
    const isOnline = await checkServerStatus()
    
    // Validate any changes in server status
    checkForStatusChange(isOnline)

    // Update bot status
    updateBotStatus(isOnline)


    // Schedule periodic server checks
    setInterval(async () => {
        const isOnline = await checkServerStatus()
        console.log(isOnline)
        checkForStatusChange(isOnline)
        updateBotStatus(isOnline)
    }, 20000) // 20 seconds
});

client.login(DISCORD_BOT_TOKEN)

app.get('/ping', (req, res) => {
    console.log('ping')
    res.send('pong')
})

app.listen(PORT, () => {
    console.log(`Server is running on port 4000`)
})