import { joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';
import { VoiceSession } from '../types';
import { AudioPlayerService } from './player';

export class VoiceService {
    private static sessions = new Map<string, VoiceSession>();

    static join(channel: VoiceBasedChannel): VoiceSession {
        this.leave(channel.guild.id);

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false,
        });

        connection.on("stateChange", (oldState, newState) => {
            console.log(`Connection state: ${oldState.status} → ${newState.status}`);
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                this.leave(channel.guild.id);
            }
        });

        setTimeout(() => {
            if (connection.state.status === "signalling") {
                console.log("Force-disconnecting...");
                connection.destroy();
            }
        }, 5000);

        const player = new AudioPlayerService()

        const session: VoiceSession = {
            connection: connection,
            player: player
        }

        this.sessions.set(channel.guild.id, session);

        connection.subscribe(player.getPlayer());

        return session;
    }

    static leave(guildId: string): boolean {
        const session = this.sessions.get(guildId);
        if (session) {
            session.connection.destroy()
            session.player.stop()
            this.sessions.delete(guildId)
            return true
        }
        return false
    }

    static getSession(guildId: string): VoiceSession | undefined {
        return this.sessions.get(guildId)
    }
}
