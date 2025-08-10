import { Client, GatewayIntentBits, REST, Routes, User } from 'discord.js'
import dotenv from 'dotenv'

import { COMMANDS, executeCommand } from './commands/commands'

dotenv.config()

export let devUserCache: { user: User; timestamp: number } | null = null;
export const CACHE_TTL_MS = 3600000
const DEV_USER_ID = '541679358763335694'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
})

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!)

async function deployCommands() {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: COMMANDS }
        );
    } catch (error) {
        console.error('Failed to deploy commands:', error)
    }
}


client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        await executeCommand(interaction)
    }
})

client.on('ready', () => {
    updateDevUserCache(client).catch(console.error)
    deployCommands()
    console.log(`✅ Bot is online as ${client.user?.tag}`)
})


client.login(process.env.DISCORD_TOKEN)

function fetchUser(client: Client, id: string): Promise<User> {
    return client.users.fetch(id)
}

export async function updateDevUserCache(client: Client) {
    try {
        const user = await fetchUser(client, DEV_USER_ID)
        devUserCache = {
            user: user,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Failed to update dev cache:', error)
    }
}
