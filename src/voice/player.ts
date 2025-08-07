import { createAudioPlayer, AudioPlayerStatus, createAudioResource, StreamType, AudioPlayer, NoSubscriberBehavior } from '@discordjs/voice';
import { getRandomIntermission } from '../utils';
import config from '../config';

export class AudioPlayerService {
    private player: AudioPlayer
    private queue = new Array<string>()
    private intermissionQueue = new Array<string>()

    private nextTrackCounter = 0
    private intermissionPlayed = false

    public constructor() {
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
                maxMissedFrames: 5,
            },
        });

        this.setupEventHandlers();
    }

    private async intermissionQueueManager() {
        const targetSize = config.intermissionQueueSize

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

    private play(track: string) {
        const resource = createAudioResource(track, {
            inputType: StreamType.Arbitrary,
            inlineVolume: true,
        });
        this.player.play(resource)

        console.log('[Playing] ' + track)
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
        if (
            this.nextTrackCounter > 0
            && this.nextTrackCounter % config.intermissionEveryXTracks === 0
            && !this.intermissionPlayed
        ) {
            await this.playIntermission()
            return
        }

        const track = this.queue.at(this.nextTrackCounter)

        this.nextTrackCounter++
        this.intermissionPlayed = false

        if (track) {
            this.play(track)
        } else if (this.queue.length > 0) {
            console.log('Queue is empty - looping...')
            this.nextTrackCounter = 0

            this.shuffleQueue()
            this.playNextInQueue()
        }
    }

    public async playIntermission() {
        await this.intermissionQueueManager()

        const track = this.intermissionQueue.shift()!

        if (track) {
            this.play(track)
        }

        this.intermissionPlayed = true
    }

    public getPlayer(): AudioPlayer {
        return this.player;
    }

    public getQueue(): string[] {
        return this.queue
    }
}


