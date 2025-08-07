import { BotCommand } from "../types";
import { VoiceService } from "../voice/service";
import config from "../config";

export const shuffle: BotCommand = {
    data: {
        name: 'shuffle',
        description: 'Shuffles the queue'
    },
    async execute(interaction) {
        const guildID = interaction.guild?.id

        if (!guildID) {
            return interaction.reply(config.messages.voiceChannelRequired)
        }

        const session = VoiceService.getSession(guildID)

        session?.player.shuffle()

        return interaction.reply("Shuffled the queue")
    }
};
