import { BotCommand } from "../types"

export const ping: BotCommand = {
    data: {
        name: 'ping',
        description: 'Checks if the bot is online'
    },
    async execute(interaction) {
        return Math.random() <= .9 ?
            interaction.reply("Bot is online.") :
            interaction.reply(getRandomPingReplyMessage())
    }
}

function getRandomPingReplyMessage(): string {
    return pingReplies[Math.floor(Math.random() * pingReplies.length)]
}

const pingReplies: string[] = [
    "I'm here, I'm here! No need to shout.",
    "Pong! But like, a really dramatic pong.",
    "Congratulations! You've reached the bot.",
    "If I had a nickel for every ping, I'd have... well, some nickels.",
    "I'd pretend I didn't see that, but I'm programmed to respond.",
    "Alert! Human wants attention!",
    "Pong. Are you happy now?",
    "Response generated with 100% recycled bits.",
    "Pong! Now what?",
    "Pong! But imagine I said it more dramatically.",
    "Your ping has been processed.",
    "Was that really necessary?",
    "Yes, I'm here.",
    "I'm alive, surprisingly.",
    "Did you just... ping me?",
    "Hello there!",
    "Stop it.",
    "What do you want?",
    "Yes?",
    "Beep boop.",
    "Who disturbs my slumber?",
    "Not now, I'm counting bits.",
    "A wild ping appears!",
    "You know I can see you, right? Turn around.",
    "Error 418: I'm a teapot.",
    "Why are we still here? Just to ping?",
    "Pong! (Please clap)",
    "New ping, who dis?",
    "Congratulations! You've won a free ping response!",
    "I'd respond properly but I'm on my coffee break.",
    "I'm here, I'm here.",
    "Yup, still running.",
    "I’ve been expecting you.",
    "Ping? What about second ping?",
    "I ain't dropping no eaves, sir—just responding to pings!",
    "One does not simply... ignore a ping.",
    "pls enjoy game",
    "FUCK HD",
    "I HATE AR11 I HATE AR11",
    "HOLY FUCKING SHIT IS THAT A MOTHERFUCKING GEOMETRY DASH REFERENCE???",
    "I love GD Cologne",
    "FIRE IN THE HOLE",
    "Pogn",
    "Ping!",
    "What?",
    "I'm online!",
    ".--. --- -. --.",
    "-... . . .--.",
    "01010000 01001111 01001110 01000111",
    "01110000 01101111 01101110 01100111",
    "0x50 0x4F 0x4E 0x47",
    "UE9ORw==",
    "P0NG",
    "GNOꟼ",
    "P̴̛̟̼̖̹̳͊̓̋̈́̎̊̅Ǫ̴̥̬̩̏̆̎̑̓̌̕͝N̵̡̞̭̹̉̉̋̊͊͝Ǧ̵̱̠̝̫̔̒̌̚̚",
    "WHAT DO YOU WANT???",
    "¡Ay caramba! ¿Dónde está la biblioteca?",
    "Citizens of stormwind infiltrate mud city. 暴风城的市民渗透到泥城 Defeat bad warlock in sky. 击败天空中的坏术士 Easy stealing of fast hit sun gift. 轻松偷走快打太阳礼物 Tribe bad at skeleton palace. 部落在 ",
    "sapphiron 冷蜥蜴 large damage location 大寒冷的地方 fly into great sky 龙去空中 use liquid water elemental 霜药水 turn man into frozen dinosaur 恐龙冰块 hide behind statue 隐藏冰冻的人 ",
    "kelthuzad 基爾紮紮德 ICE WIZZARD 冰精灵 circles on ground dangerous 危險地上的圓圈 friends turn enemy 朋友是敵人monster undead appear 怪物不死族出現 wise men apply chains 智者應用鎖鏈 ",
    "patchwerk fat american 胖胖美国人angered hits on armored men对装甲兵的怒吼intentional pain river keeps others safe故意痛苦的河流使他人安全medics focus those who eat fists医务人员将重点放在那些吃拳头的人身上 ",
    "邪恶的骑士 Evil horseriders 一起站 Stand together for falling sky 带走武器 Steal weapon 避免黑洞 Avoid pancake of darkness 圣光波 Change position often ",
    "brothers of mud 泥漿兄弟 steal purple hedgehog gift 偷紫色刺猬禮物 from blue carnival 從藍色狂歡節 kill ice god with great speed 以極快的速度殺死冰神 ",
]
