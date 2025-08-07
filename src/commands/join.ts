import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { VoiceService } from '../voice/service';
import { BotCommand } from '../types';
import { getSongListFromLocalFiles } from '../utils';

export const join: BotCommand = {
    data: {
        name: 'join',
        description: 'Joins your voice channel'
    },
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inGuild()) {
            return interaction.reply('This command only works in servers')
        }

        const member = await interaction.guild?.members.fetch(interaction.user.id)
        const channel = member?.voice.channel

        if (!channel) {
            return interaction.reply({
                content: 'You must be in a voice channel to do this',
                flags: MessageFlags.Ephemeral
            })
        }

        try {
            const session = VoiceService.join(channel)

            const songs = await getSongListFromLocalFiles()
            songs.forEach(s => session.player.addToQueue(s))

            session.player.shuffleQueue()
            session.player.playNextInQueue()

            return interaction.reply(`Joined ${channel.name}`)
        } catch (error) {
            console.error(error)
            return interaction.reply({
                content: 'Failed to join voice channel',
                flags: MessageFlags.Ephemeral
            })
        }
    }
}


