import { VoiceConnection } from "@discordjs/voice"
import { ChatInputCommandInteraction } from "discord.js"
import { AudioPlayerService } from "./voice/player"

export interface BotCommand {
    data: {
        name: string
        description: string
        options?: any[]
    }
    execute: (interaction: ChatInputCommandInteraction) => Promise<any>
}

export type VoiceSession = {
    connection: VoiceConnection,
    player: AudioPlayerService
} 
