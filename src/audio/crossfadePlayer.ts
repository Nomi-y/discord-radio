import { AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource } from '@discordjs/voice'
import net from 'net'
import config from '../../config.json'
import { VoiceState } from 'discord.js'

const MAX_RETRIES = 3
var retryCount = 0

export class CrossfadePlayer {

    public static discordPlayer = createAudioPlayer()

    public static async play() {
        const resource = await createAudioResourceFromIcecast()
        CrossfadePlayer.discordPlayer.play(resource)
    }

    public static stop() {
        CrossfadePlayer.discordPlayer.stop()
    }

    static async skip(): Promise<string> {
        return new Promise((resolve) => {
            const client = net.createConnection({
                host: 'liquidsoap',
                port: 1234
            })

            let response = ''

            client.on('connect', () => {
                client.write('radio.skip\n')
            })

            client.on('data', (data) => {
                response += data.toString()
                if (response.includes('> ')) {
                    client.end();
                }
            })

            client.on('end', () => {
                resolve(response.trim())
            })

            client.on('error', (err) => {
                resolve(`Error: ${err.message}`)
            })
        })
    }
}

async function createAudioResourceFromIcecast(): Promise<AudioResource> {
    try {
        return createAudioResource('http://icecast:8000/stream')
    } catch (err) {
        if (retryCount < MAX_RETRIES) {
            const delay = Math.pow(2, retryCount) * 1000
            retryCount++
            await new Promise(res => setTimeout(res, delay))
            return createAudioResourceFromIcecast()
        }
        throw err
    }
}

CrossfadePlayer.discordPlayer.on('stateChange', (_, state) => {
    if (state.status === AudioPlayerStatus.Idle) {
        console.log('Player idling...')
        CrossfadePlayer.play()
        setTimeout(() => { }, 3000)
    }
})

CrossfadePlayer.play()

