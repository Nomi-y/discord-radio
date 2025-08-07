import type { BotCommand } from '../types';
import { ChatInputCommandInteraction } from 'discord.js';


import { ping } from './ping';
import { join } from './join';
import { pause } from './pause'
import { play } from './play';
import { shuffle } from './shuffle';
import { skip } from './skip';

export const commands: Record<string, BotCommand> = {
    ping,
    join,
    pause,
    play,
    shuffle,
    skip
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
