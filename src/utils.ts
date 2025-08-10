import fs from 'fs/promises'
import config from './config'
import path from 'path'
import { Interaction, VoiceBasedChannel } from 'discord.js'

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

export async function getRandomIntermission(): Promise<string | null> {
    try {
        const files = (await fs.readdir(config.paths.intermissions))
            .filter(f => f.endsWith('.mp3'))
            .map(f => path.join(config.paths.intermissions, f))
        return files[Math.floor(Math.random() * files.length)]
    } catch (e) {
        console.error(e)
        return null
    }
}

export async function getIntermissionJingle(): Promise<string | null> {
    try {
        const files = (await fs.readdir(config.paths.jingle))
            .filter(f => f.endsWith('.mp3'))
            .map(f => path.join(config.paths.jingle, f))
        return files[Math.floor(Math.random() * files.length)]
    } catch (e) {
        console.error(e)
        return null
    }
}

export const InteractionHelper = {

    async isInVoiceChannel(interaction: Interaction): Promise<boolean> {
        const member = await interaction.guild?.members.fetch(interaction.user.id)
        const channel = member?.voice.channel
        return !!channel
    },

    async getUserVoiceChannel(interaction: Interaction): Promise<VoiceBasedChannel | null | undefined> {
        const member = await interaction.guild?.members.fetch(interaction.user.id)
        return member?.voice.channel
    }
}

export function calculateIntermissionInterval(
    lowerBound: number,
    upperBound: number,
    options?: { maxRandom?: number }
): number {
    const MAX_RANDOM = options?.maxRandom ?? 99999

    if (lowerBound === -1 && upperBound === -1) {
        return getRandomInRange(1, MAX_RANDOM)
    }

    if (lowerBound === -1) {
        return getRandomInRange(1, Math.max(1, upperBound))
    }

    if (upperBound === -1) {
        return getRandomInRange(lowerBound, MAX_RANDOM)
    }

    return getRandomInRange(
        Math.max(1, lowerBound),
        Math.max(Math.max(1, lowerBound), upperBound)
    )
}

export function getRandomInRange(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
