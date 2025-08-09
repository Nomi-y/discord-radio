import { ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import { VoiceService } from '../voice/service'
import { BotCommand } from '../types'
import { getSongListFromLocalFiles, InteractionHelper } from '../utils'
import config from '../config'
export const play: BotCommand = {
    data: {
        name: 'play',
        description: 'Starts / Resumes playback'
    },
    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.inGuild()) {
            return interaction.reply(config.messages.guildRequired)
        }

        const channel = await InteractionHelper.getUserVoiceChannel(interaction)

        if (!channel) {
            return interaction.reply({
                content: config.messages.voiceChannelRequired,
                flags: MessageFlags.Ephemeral
            })
        }

        try {
            const session = VoiceService.join(channel)

            const songs = await getSongListFromLocalFiles()
            songs.forEach(s => session.player.addToQueue(s))

            session.player.shuffle()
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


