export class SlidingWindowQueue<T> {
    private readonly queue: T[] = []
    private readonly recentItems: Set<T> = new Set()

    constructor(private readonly noDuplicateWindow: number) { }

    public add(item: T): boolean {
        if (this.recentItems.has(item)) {
            return false
        }

        this.queue.push(item)
        this.recentItems.add(item);

        if (this.noDuplicateWindow > 0 && this.queue.length > this.noDuplicateWindow) {
            const oldest = this.queue.shift()!
            this.recentItems.delete(oldest)
        }

        return true;
    }

    public shift(): T {
        if (this.queue.length === 0) throw new Error("Queue is empty")
        const item = this.queue.shift()!
        this.recentItems.delete(item)
        return item
    }

    public length(): number {
        return this.queue.length
    }
}
