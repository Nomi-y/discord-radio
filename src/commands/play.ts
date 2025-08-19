import { CommandInteraction } from 'discord.js'
import { BotCommand } from '../types'
import { getSongListFromLocalFiles, InteractionHelper } from '../utils'
import { AudioService } from '../audio/service'
import config from '../config'

export const play: BotCommand = {
    data: {
        name: 'play',
        description: 'Starts / Resumes playback'
    },
    async execute(interaction: CommandInteraction) {
        if (!interaction.guild?.id) {
            return interaction.reply(config.messages.guildRequired)
        }

        const channel = await InteractionHelper.getUserVoiceChannel(interaction)

        if (!channel) {
            return interaction.reply({
                content: config.messages.voiceChannelRequired,
                flags: 64
            })
        }


        try {
            const session = await AudioService.join(channel)

            return interaction.reply(`Joined ${channel.name}`)
        } catch (error) {
            console.error(error)
            return interaction.reply({
                content: 'Failed to join voice channel',
                flags: 64
            })
        }
    }
}


