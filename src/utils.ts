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
