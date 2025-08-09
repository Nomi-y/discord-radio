import path from "path"

export default {
    paths: {
        music: path.join(__dirname, "../resources/music/"),
        intermissions: path.join(__dirname, "../resources/intermissions/"),
    },
    intermissionEveryXTracks: 2,
    intermissionQueueSize: 1,

    messages: {
        guildRequired: 'This command only works in servers',
        voiceChannelRequired: 'You must be in a voice channel to do this',

        noSessionInThisGuild: 'There is no active playback in this server'
    }
}
