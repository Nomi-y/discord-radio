import { BotCommand } from "../types";
import { VoiceService } from "../voice/service";
import config from "../config";

export const play: BotCommand = {
    data: {
        name: 'play',
        description: 'Resumes playback'
    },
    async execute(interaction) {
        const guildID = interaction.guild?.id

        if (!guildID) {
            return interaction.reply(config.messages.voiceChannelRequired)
        }

        const session = VoiceService.getSession(guildID)

        session?.player.unpause()

        return interaction.reply("Resumed playback")
    }
};
