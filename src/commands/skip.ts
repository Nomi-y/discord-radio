import { MessageFlags } from "discord.js"

import { BotCommand } from "../types"
import { AudioService } from "../audio/service"
import config from "../config"
import { InteractionHelper } from "../utils"
import { CrossfadePlayer } from "../audio/crossfadePlayer"

export const skip: BotCommand = {
    data: {
        name: 'skip',
        description: 'Skip the current track'
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

        CrossfadePlayer.skip()

        return interaction.reply("Skipped track")
    }
};
