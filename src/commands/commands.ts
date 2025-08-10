import type { BotCommand } from '../types'
import { ChatInputCommandInteraction } from 'discord.js'


import { ping } from './ping'
import { pause } from './pause'
import { play } from './play'
import { shuffle } from './shuffle'
import { skip } from './skip'
import { stop } from './stop'
import { dev } from './dev'


export const commands: Record<string, BotCommand> = {
    ping,
    pause,
    play,
    shuffle,
    skip,
    stop,
    dev
};

export const COMMANDS = Object.values(commands).map(cmd => cmd.data)

export async function executeCommand(interaction: ChatInputCommandInteraction) {
    const command = commands[interaction.commandName]
    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error)
        await interaction.reply({
            content: '❌ An error occurred while executing this command',
            ephemeral: true
        });
    }
}
