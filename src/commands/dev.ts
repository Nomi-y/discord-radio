import { MessageFlags } from "discord.js"
import { BotCommand } from "../types"
import { CACHE_TTL_MS, devUserCache, updateDevUserCache } from ".."

export const dev: BotCommand = {
    data: {
        name: 'dev',
        description: 'Who made this crap?'
    },
    async execute(interaction) {
        if (!devUserCache || Date.now() - devUserCache.timestamp > CACHE_TTL_MS) {
            await updateDevUserCache(interaction.client)
        }
        return interaction.reply({
            content:
                `
${devUserCache?.user.globalName} [ ${devUserCache?.user.username} ]
https://github.com/Nomi-y/discord-radio
`,
            flags: MessageFlags.Ephemeral
        })
    }
}

