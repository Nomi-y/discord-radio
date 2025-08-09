import { MessageFlags } from "discord.js"

import { BotCommand } from "../types"
import { VoiceService } from "../voice/service"
import config from "../config"
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

        const session = VoiceService.getSession(guildID)

        if (!session) {
            return interaction.reply({
                content: config.messages.noSessionInThisGuild,
                flags: MessageFlags.Ephemeral
            })
        }

        VoiceService.leave(guildID)

        return interaction.reply('Stopped playback')

    }
};
