import { createAudioPlayer, AudioPlayerStatus, createAudioResource, StreamType, AudioPlayer, NoSubscriberBehavior, AudioResource } from '@discordjs/voice'
import { spawn } from 'node:child_process'

import { getRandomIntermission, calculateIntermissionInterval, getIntermissionJingle } from '../utils'
import config from '../config'

export class AudioPlayerService {
    private player: AudioPlayer
    private queue = new Array<string>()
    private intermissionQueue = new Array<string>()

    private nextTrackCounter = 0
    private nextIntermissionCounter: number

    public constructor() {
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
                maxMissedFrames: 5,
            },
        })

        this.nextIntermissionCounter = calculateIntermissionInterval(
            config.intermission.interval.lowerBound,
            config.intermission.interval.upperBound)

        this.setupEventHandlers()
    }

    private async intermissionQueueManager() {
        const targetSize = config.intermission.noRepeatQueueSize

        while (this.intermissionQueue.length < targetSize) {
            const im = await getRandomIntermission()
            if (!im) {
                console.error("Failed to fetch intermission")
                continue
            }

            if (!this.intermissionQueue.includes(im)) {
                this.intermissionQueue.push(im)
            }
        }
    }

    private setupEventHandlers() {
        this.player.on(AudioPlayerStatus.Idle, () => {
            this.playNextInQueue()
        })

        this.player.on('error', error => {
            console.error('[Audio] Player error:', error);
        });
    }

    private play(track: AudioResource) {
        this.player.play(track)
    }

    public stop() {
        this.player.stop()
        this.queue = []
    }

    public pause() {
        this.player.pause();
    }

    public unpause() {
        this.player.unpause();
    }

    public addToQueue(track: string) {
        this.queue.push(track)
    }

    public removeFromQueue(track: string) {
        const index = this.queue.indexOf(track)
        if (index !== -1) {
            this.queue.splice(index, 1)
        }
    }

    public shuffle() {
        this.shuffleQueue()
        this.nextTrackCounter = 0
        this.playNextInQueue()
    }

    private shuffleQueue() {
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]]
        }
    }

    public async playNextInQueue() {
        if (this.shouldPlayIntermission()) {
            await this.playIntermission()
            return
        }

        const track = this.queue.at(this.nextTrackCounter)

        this.nextTrackCounter++
        this.nextIntermissionCounter--

        if (track) {
            const recource = await createTrackAudio(track)
            this.play(recource)
        } else if (this.queue.length > 0) {
            console.log('Queue is empty - looping...')
            this.nextTrackCounter = 0

            this.shuffleQueue()
            this.playNextInQueue()
        }
    }

    public async playIntermission() {
        await this.intermissionQueueManager()

        this.nextIntermissionCounter = calculateIntermissionInterval(
            config.intermission.interval.lowerBound,
            config.intermission.interval.upperBound
        )

        const track = this.intermissionQueue.shift()!
        const preJingle = config.intermission.jingle.before ?
            await getIntermissionJingle() :
            null
        const postJingle = config.intermission.jingle.after ?
            await getIntermissionJingle() :
            null

        if (track) {
            const resource = await createTrackAudio(track, {
                preJinglePath: preJingle,
                postJinglePath: postJingle
            })
            this.play(resource)
        }
    }

    public getPlayer(): AudioPlayer {
        return this.player
    }

    public getQueue(): string[] {
        return this.queue
    }

    public shouldPlayIntermission(): boolean {
        return this.nextTrackCounter > 0
            && this.nextIntermissionCounter === 0
    }

}


async function createTrackAudio(
    mainTrackPath: string,
    options?: {
        preJinglePath?: string | null
        postJinglePath?: string | null
    }
): Promise<AudioResource> {
    const filter = [
        options?.preJinglePath ? `[0][1]concat=n=2:v=0:a=1` : '',
        options?.postJinglePath ? `[a][2]concat=n=2:v=0:a=1` : ''
    ].filter(Boolean).join(';')

    const args = [
        ...(options?.preJinglePath ? ['-i', options.preJinglePath] : []),
        '-i', mainTrackPath,
        ...(options?.postJinglePath ? ['-i', options.postJinglePath] : []),
        '-filter_complex', filter || 'anull',
        '-f', 'opus',
        '-ar', '48000',
        '-ac', '2',
        '-b:a', '192k',
        'pipe:1'
    ]

    const ffmpeg = spawn('ffmpeg', args);

    ffmpeg.stderr.on('data', (chunk) => console.error(chunk.toString()))
    ffmpeg.on('error', console.error)

    return createAudioResource(ffmpeg.stdout, {
        inputType: StreamType.Opus,
        inlineVolume: true
    })
}


