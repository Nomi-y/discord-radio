import fs from 'fs/promises'
import config from '../config.json'
import path from 'path'
import { CommandInteraction, VoiceBasedChannel } from 'discord.js'

const projectRoot = path.resolve(__dirname, '..')

export async function getSongListFromLocalFiles(): Promise<string[]> {
    try {
        const music = path.resolve(projectRoot, config.paths.music)
        const files = (await fs.readdir(music))
            .map(f => path.join(music, f))
        return files
    } catch (e) {
        console.error(e)
        return []
    }
}

export async function getRandomIntermission(): Promise<string | null> {
    try {
        const interm = path.resolve(projectRoot, config.paths.intermissions)
        const files = (await fs.readdir(interm))
            .map(f => path.join(interm, f))
        return files[Math.floor(Math.random() * files.length)]
    } catch (e) {
        console.error(e)
        return null
    }
}

export async function getJingle(): Promise<string | null> {
    try {
        const jingel = path.resolve(projectRoot, config.paths.music)
        const files = (await fs.readdir(jingel))
            .map(f => path.join(jingel, f))
        return files[Math.floor(Math.random() * files.length)]
    } catch (e) {
        console.error(e)
        return null
    }
}

export const InteractionHelper = {

    async isInVoiceChannel(interaction: CommandInteraction): Promise<boolean> {
        const member = await interaction.guild?.members.fetch(interaction.user.id)
        return !!member?.voice.channel
    },

    async getUserVoiceChannel(interaction: CommandInteraction): Promise<VoiceBasedChannel | null | undefined> {
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
