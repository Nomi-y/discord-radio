import { BotCommand } from "../types";
import { VoiceService } from "../voice/service";
import config from "../config";

export const skip: BotCommand = {
    data: {
        name: 'skip',
        description: 'Skip the current track'
    },
    async execute(interaction) {
        const guildID = interaction.guild?.id

        if (!guildID) {
            return interaction.reply(config.messages.voiceChannelRequired)
        }

        const session = VoiceService.getSession(guildID)

        session?.player.playNextInQueue()

        return interaction.reply("Skipped track")
    }
};
