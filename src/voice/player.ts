import { createAudioPlayer, AudioPlayerStatus, createAudioResource, StreamType, AudioPlayer, NoSubscriberBehavior } from '@discordjs/voice';

export class AudioPlayerService {
    private player: AudioPlayer
    private queue = new Array<string>()
    private nextTrack = 0

    public constructor() {
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
                maxMissedFrames: 5,
            },
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        this.player.on(AudioPlayerStatus.Playing, () => {
            console.log(`[Audio] Playback started: ${this.queue.at(this.nextTrack - 1)}`);
        });

        this.player.on(AudioPlayerStatus.Idle, () => {
            this.playNextInQueue()
        })

        this.player.on('error', error => {
            console.error('[Audio] Player error:', error);
        });

        this.player.on("stateChange", (oldState, newState) => {
            console.log(`Player state: ${oldState.status} → ${newState.status}`);
        });
    }

    private play(track: string) {
        const resource = createAudioResource(track, {
            inputType: StreamType.Arbitrary,
            inlineVolume: true,
        });
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
        console.log("Added " + track + " to queue")
        console.log(this.queue)
    }

    public removeFromQueue(track: string) {
        const index = this.queue.indexOf(track)
        if (index !== -1) {
            this.queue.splice(index, 1)
        }
    }

    public playNextInQueue() {
        const track = this.queue.at(this.nextTrack)

        this.nextTrack++
        if (track) {
            this.play(track)
            console.log('Playing ' + track)
        } else {
            console.log('Queue is empty')
        }
    }

    public getPlayer(): AudioPlayer {
        return this.player;
    }

    public getQueue(): string[] {
        return this.queue
    }
}


