import { CommandInteraction } from "discord.js"
import { CrossfadePlayer } from "./audio/crossfadePlayer"
import { VoiceConnection } from "@discordjs/voice"

export interface BotCommand {
    data: {
        name: string
        description: string
        options?: any[]
    }
    execute: (interaction: CommandInteraction) => Promise<any>
}

export type VoiceSession = {
    connection: VoiceConnection,
}

export interface Config {

}
