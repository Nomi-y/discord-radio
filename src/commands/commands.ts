import type { BotCommand } from '../types'
import { CommandInteraction } from 'discord.js';


import { ping } from './ping'
import { play } from './play'
import { skip } from './skip'
import { stop } from './stop'
import { dev } from './dev'


export const commands: Record<string, BotCommand> = {
    ping,
    play,
    skip,
    stop,
    dev
}

export const COMMANDS = Object.values(commands).map(cmd => cmd.data)

export async function executeCommand(interaction: CommandInteraction) {
    const command = commands[interaction.commandName]
    if (!command) return
    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(`Error executing ${interaction.token}:`, error)
        await interaction.reply(
            '❌ An error occurred while executing this command',
        );
    }
}
