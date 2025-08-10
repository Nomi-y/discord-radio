import path from "path"

export default {
    paths: {
        music: path.join(__dirname, "../resources/music/"),
        intermissions: path.join(__dirname, "../resources/intermissions/"),
        jingle: path.join(__dirname, "../resources/jingle/")
    },

    intermission: {
        noRepeatQueueSize: 1,
        // Max # of unique intermissions before they can repeat
        //
        jingle: {
            before: true,
            after: true,
            // Enable/disable jingles before/after intermissions 
            //
        },
        interval: {
            lowerBound: 3,     // Min tracks between intermissions
            upperBound: 6,     // Max tracks between intermissions
            // For completely random bounds set one or both to -1
        },
    },

    messages: {
        guildRequired: 'This command only works in servers',
        voiceChannelRequired: 'You must be in a voice channel to do this',
        noSessionInThisGuild: 'There is no active playback in this server'
    }
}
