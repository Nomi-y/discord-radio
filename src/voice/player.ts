import { createAudioPlayer, AudioPlayerStatus, StreamType, AudioPlayer, NoSubscriberBehavior, AudioResource, createAudioResource } from '@discordjs/voice'
import { spawn } from 'node:child_process'
import prism from 'prism-media'

import { calculateIntermissionInterval, getJingle, getRandomIntermission } from '../utils'
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
            config.intermission.interval.upperBound
        )
        this.setupEventHandlers();
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

    private play(resource: AudioResource) {
        this.player.play(resource)
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

    public async playNextInQueue(): Promise<void> {
        if (this.nextTrackCounter >= this.queue.length && this.queue.length > 0) {
            console.log('Queue is empty - looping...')
            this.nextTrackCounter = 0

            this.shuffleQueue()
            return this.playNextInQueue()
        }

        console.log(this.nextIntermissionCounter)

        if (this.shouldPlayIntermission()) {
            await this.playIntermission()
            return
        }
        this.nextIntermissionCounter--

        const track = this.queue.at(this.nextTrackCounter)

        this.nextTrackCounter++

        if (track) {
            const resource = await encodeAudioTrack(track)
            this.play(resource)
        }
    }

    public async playIntermission() {
        await this.intermissionQueueManager()
        this.nextIntermissionCounter = calculateIntermissionInterval(
            config.intermission.interval.lowerBound,
            config.intermission.interval.upperBound
        )

        const track = this.intermissionQueue.shift()!
        const jingleConfig = config.intermission.jingle
        const jingleSound = await getJingle()
        console.log(jingleSound)
        const jingle = {
            pre: jingleConfig.before && jingleSound ? jingleSound : undefined,
            after: jingleConfig.after && jingleSound ? jingleSound : undefined
        }

        if (track) {
            const resource = await encodeAudioTrack(track, {
                pre: jingle.pre,
                after: jingle.after
            })
            this.play(resource)
        }
        console.debug(`next intermission in: ${this.nextIntermissionCounter}`)
    }

    public shouldPlayIntermission(): boolean {
        return this.nextIntermissionCounter <= 0
    }

    public getPlayer(): AudioPlayer {
        return this.player
    }

    public getQueue(): string[] {
        return this.queue
    }

}

// I spent 3 hours debugging audio streams...
async function encodeAudioTrack(track: string, options?: {
    pre?: string,
    after?: string,
}): Promise<AudioResource> {
    const ffmpegArgs = [
        '-loglevel', 'warning'
    ]

    if (options?.pre) {
        ffmpegArgs.push('-i', options.pre);
    }

    ffmpegArgs.push('-i', track);

    if (options?.after) {
        ffmpegArgs.push('-i', options.after);
    }

    const filter = []
    let inputCount = 0

    if (options?.pre) {
        filter.push(`[${inputCount++}:a]`)
    }

    filter.push(`[${inputCount++}:a]`)

    if (options?.after) {
        filter.push(`[${inputCount}:a]`)
    }

    ffmpegArgs.push(
        '-filter_complex',
        `${filter.join('')}concat=n=${inputCount + (options?.after ? 1 : 0)}:v=0:a=1[a]`,
        '-map', '[a]',
        '-f', 's16le',
        '-ar', '48000',
        '-ac', '2',
        '-b:a', '192k',
        'pipe:1'
    )

    const ffmpeg = spawn('ffmpeg', ffmpegArgs)

    const opus = new prism.opus.Encoder({
        rate: 48000,
        channels: 2,
        frameSize: 960
    })

    const stream = ffmpeg.stdout.pipe(opus)

    return createAudioResource(stream, {
        inputType: StreamType.Opus,
        inlineVolume: true,
    })
}


