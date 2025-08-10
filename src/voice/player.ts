import { createAudioPlayer, AudioPlayerStatus, createAudioResource, StreamType, AudioPlayer, NoSubscriberBehavior } from '@discordjs/voice'
import { spawn } from 'node:child_process'
import prism from 'prism-media'

import { calculateIntermissionInterval, getRandomIntermission } from '../utils'
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

    // I spent 3 hours debugging audio streams...
    private play(track: string) {
        const ffmpeg = spawn('ffmpeg', [
            '-i', track,
            '-f', 's16le',
            '-ar', '48000',
            '-ac', '2',             // Stereo
            '-loglevel', 'warning',
            '-b:a', '192k',
            'pipe:1'               // Output to stdout
        ])

        const opus = new prism.opus.Encoder({
            rate: 48000,
            channels: 2,
            frameSize: 960
        })

        const stream = ffmpeg.stdout.pipe(opus)

        const resource = createAudioResource(stream, {
            inputType: StreamType.Opus,
            inlineVolume: true,
        })

        this.player.play(resource)

        // console.log('[Playing] ' + track)
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
        if (this.nextTrackCounter >= this.queue.length) {
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
            this.play(track)
        }
    }

    public async playIntermission() {
        await this.intermissionQueueManager()
        this.nextIntermissionCounter = calculateIntermissionInterval(
            config.intermission.interval.lowerBound,
            config.intermission.interval.upperBound
        )

        const track = this.intermissionQueue.shift()!

        if (track) {
            this.play(track)
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


