import fs from 'fs/promises'
import config from './config'
import path from 'path/posix'

export async function getSongListFromLocalFiles(): Promise<string[]> {
    try {
        const files = (await fs.readdir(config.paths.music))
            .filter(f => f.endsWith('.mp3'))
            .map(f => path.join(config.paths.music, f))
        return files
    } catch (e) {
        console.error(e)
        return []
    }
}
