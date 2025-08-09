import { Client, GatewayIntentBits, REST, Routes } from 'discord.js'
import dotenv from 'dotenv'

import { COMMANDS, executeCommand } from './commands/commands'

dotenv.config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!)

async function deployCommands() {
    try {
        console.log('Refreshing slash commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: COMMANDS }
        );

        console.log('Commands deployed!');
    } catch (error) {
        console.error('Failed to deploy commands:', error)
    }
}
// Silencing warning from @discordjs/voice setting negative timeouts
process.on('warning', warning => {
    if (warning.name !== 'TimeoutNegativeWarning') {
        console.warn(warning)
    }
})

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        await executeCommand(interaction)
    }
});

client.on('ready', () => {
    console.log(`✅ Bot is online as ${client.user?.tag}`)
    deployCommands()
})


client.login(process.env.DISCORD_TOKEN);
