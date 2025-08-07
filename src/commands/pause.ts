import { BotCommand } from "../types";
import { VoiceService } from "../voice/service";
import config from "../config";

export const pause: BotCommand = {
    data: {
        name: 'pause',
        description: 'Pauses playback'
    },
    async execute(interaction) {
        const guildID = interaction.guild?.id

        if (!guildID) {
            return interaction.reply(config.messages.voiceChannelRequired)
        }

        const session = VoiceService.getSession(guildID)

        session?.player.pause()

        return interaction.reply("Paused playback")
    }
};
