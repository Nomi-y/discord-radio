import { BotCommand } from "../types"

export const ping: BotCommand = {
    data: {
        name: 'ping',
        description: 'Checks if the bot is online'
    },
    async execute(interaction) {
        await interaction.reply('Good fucking morning')
    }
};
