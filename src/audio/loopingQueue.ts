export class LoopingQueue<T> {
    private index: number = 0
    private _onLoop: (() => void) | null = null
    private queue: T[] = []
    public autoshuffle: boolean = false

    public constructor({
        queue = [],
        autoshuffle = false
    }: {
        queue?: T[],
        autoshuffle?: boolean
    } = {}) {
        this.queue = [...queue]
        this.autoshuffle = autoshuffle
    }

    public set onLoop(callback: () => void) {
        this._onLoop = callback
    }

    public add(item: T): void {
        this.queue.push(item)
    }

    public shift(): T {
        if (this.isEmpty()) {
            throw new Error("Queue is empty")
        }
        const item = this.queue[this.index]
        this.advance()
        return item
    }

    public current(): T {
        if (this.isEmpty()) {
            throw new Error("Queue is empty")
        }
        return this.queue[this.index]
    }

    public next(): T {
        if (this.isEmpty()) throw new Error("Queue is empty")

        if (this.end()) {
            return this.queue[0]
        }
        return this.queue[this.index + 1]
    }

    public size(): number {
        return this.queue.length
    }

    public isEmpty(): boolean {
        return this.size() === 0
    }

    public clear(): void {
        this.queue = []
        this.index = 0
    }

    public shuffle(): void {
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]]
        }
    }

    private end(): boolean {
        return this.index >= this.queue.length - 1
    }

    private advance(): void {
        if (this.isEmpty()) return

        if (this.end()) {
            if (this.autoshuffle) this.shuffle()
            this.index = 0
            this._onLoop?.()
        } else {
            this.index++
        }
    }
}
