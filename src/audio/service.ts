import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice'
import { VoiceSession } from '../types'
import { CrossfadePlayer } from './crossfadePlayer'
import { getSongListFromLocalFiles } from '../utils'
import config from '../../config.json'
import { VoiceBasedChannel } from 'discord.js'

export class AudioService {
    private static sessions = new Map<string, VoiceConnection>()

    static async join(channel: VoiceBasedChannel): Promise<VoiceConnection> {
        this.leave(channel)

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        })

        connection.subscribe(CrossfadePlayer.discordPlayer)

        this.sessions.set(channel.guild.id, connection)

        return connection
    }

    static leave(channel: VoiceBasedChannel): boolean {
        const connection = this.sessions.get(channel.guild.id)
        if (connection) {
            try {
                connection.destroy()
                this.sessions.delete(channel.guild.id)
                return true
            } catch (e) {
                console.error(e)
            }
        }
        return false
    }

    static getConnection(guildId: string): VoiceConnection | undefined {
        return this.sessions.get(guildId)
    }
}
