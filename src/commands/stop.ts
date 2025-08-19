import { MessageFlags } from "discord.js"

import { BotCommand } from "../types"
import { AudioService } from "../audio/service"
import config from "../../config.json"
import { InteractionHelper } from "../utils"

export const stop: BotCommand = {
    data: {
        name: 'stop',
        description: 'Stops playback'
    },
    async execute(interaction) {
        const guildID = interaction.guild?.id

        if (!guildID) {
            return interaction.reply(config.messages.guildRequired)
        }

        if (!InteractionHelper.isInVoiceChannel(interaction)) {
            return interaction.reply({
                content: config.messages.voiceChannelRequired,
                flags: MessageFlags.Ephemeral
            })
        }

        const session = AudioService.getConnection(guildID)

        if (!session) {
            return interaction.reply({
                content: config.messages.noSessionInThisGuild,
                flags: MessageFlags.Ephemeral
            })
        }

        const channel = await InteractionHelper.getUserVoiceChannel(interaction)

        AudioService.leave(channel!)

        return interaction.reply('Stopped playback')

    }
};
