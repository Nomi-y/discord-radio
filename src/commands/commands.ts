import { ping } from './ping';
import { join } from './join';
import type { BotCommand } from '../types';
import { ChatInputCommandInteraction } from 'discord.js';

export const commands: Record<string, BotCommand> = {
    ping,
    join
};

export const COMMANDS = Object.values(commands).map(cmd => cmd.data);

export async function executeCommand(interaction: ChatInputCommandInteraction) {
    const command = commands[interaction.commandName];
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        await interaction.reply({
            content: '❌ An error occurred while executing this command',
            ephemeral: true
        });
    }
}
