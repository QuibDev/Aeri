const Responses = require("../data/Responses.json");
const colors = require("../data/colors.json");
//###### KEYWORD LIST ######

function helpCommandResponse(message) {
  message.reply({
    channel_id: `${message.channelId}`,
    content: `${message.author}`,
    tts: false,
    embeds: [
      {
        type: "rich",
        title: `Aeri Commands!`,
        description: `\n:wave: hey there! My name is Aeri! [Artifical Emotion Response Interchange]. To get started, here are a few things I can do!\n\n`,
        color: colors.embededColor,
        fields: [
          {
            name: `:raised_hands:  Aeri Greetings - To check out the list of my greeting commands!\n`,
            value: "\u200B",
            inline: true,
          },
          {
            name: `:blush:  Aeri Specials - To check out the list of my special commands! \n`,
            value: "\u200B",
          },
          {
            name: `:popcorn:  Aeri MyAnimeList - To check out the list of my MAL commands! `,
            value: "\u200B",
          },
          {
            name: `:popcorn:  Aeri MovieHelp - To check out the list of my Movie Search commands! `,
            value: "\u200B",
          },
          {
            name: `:musical_note:  Aeri Music! - To check out the list of my music commands! `,
            value: "\u200B",
          },
        ],
        footer: {
          text: `Made with love by @OptimizedSoda`,
        },
      },
    ],
  });
}

function greetingHelpResponse(message) {
  message.reply({
    channel_id: `${message.channelId}`,
    content: `${message.author}`,
    tts: false,
    embeds: [
      {
        type: "rich",
        title: `~ greeting ~`,
        description: `Here are the list of all of Aeri's greeting commands!\n\n`,
        color: colors.embededColor,
        fields: [
          {
            name: `:wave: Hello - Use this when you want to say hi to me\n\n`,
            value: `> keywords: \"hello\" \"hi\" \"hey\" \"yo\" \"nihao\" \"konichiwa\" \"moshi\" `,
            inline: true,
          },
          {
            name: `:wave: Bye - Use this when you want to say your good bye greeting to me. \n`,
            value: `> keywords: \"bye\" \"see ya\" \"goodbye\" \"c ya\" \"mata\" \"jane\" \"sayonara\" `,
          },
          {
            name: `:thumbsup: Thanks - Use this when you want to appreciate aeri for her work`,
            value: `> keywords: \"thank\"  \"thanks\" \"appreciate\"  \"goodwork\" \"nicework\" \"goodjob\" \"nicejob\" \"arigato\" \"danke\" `,
          },
          {
            name: `:slight_frown:   Sorry - Use this when you are feeling sorry`,
            value: `> keywords \"sorry\" \"apology\" \"apologize\" `,
          },
          {
            name: `:sunny: Morning - use this when you want to wish good morning to Aeri`,
            value: `> keywords: \"morning\" \"goodmorning\", \"ohayō\" \"ohayo\" \"wake\" `,
          },
          {
            name: `:last_quarter_moon_with_face: Night - use this when you want to wish Aeri good night`,
            value: `> keywords: \"night\" \"goodnight\" \"sleep\" \"sweet dreams\" \"dreams\" \"bed\" \"bedtime\" \"nap\" `,
          },
          {
            name: `**Tip**`,
            value: `*Adding the keyword gif to a sentence will make Aeri send you (or a @user in the message) a gif suited to the emotion!`,
          },
        ],
        footer: {
          text: `Made with love by @OptimizedSoda`,
        },
      },
    ],
  });
}

function specialHelpResponse(message) {
  message.reply({
    channel_id: `${message.channelId}`,
    content: `${message.author}`,
    tts: false,
    embeds: [
      {
        type: "rich",
        title: `~ Specials ~`,
        description: `Here are the list of all of Aeri's special commands!`,
        color: colors.embededColor,
        fields: [
          {
            name: `:blush: Headpat - Use this when you feel down and need a headpat from Aeri\n`,
            value: `> keywords: \"headpat\" \"head\" \"pat\" `,
          },
          {
            name: `:smiling_face_with_3_hearts: Love - Use this when you want to say aeri you love her!\n`,
            value: `> keywords: \"love\" \"luv\" \"like\" \"aishteru\" `,
          },
          {
            name: `:clap: Cheer - Use this when you want Aeri to cheer you up`,
            value: `> keywords: \"cheer\" \"yay\" \"yipee\" \"woopie\" \"Omedetō\" \"omedeto\" \"sayonara\" `,
          },
          {
            name: `:birthday:  Birthday - Use this when you want Aeri to wish your / or some other person (@user) happy birthday`,
            value: `> keywords: \"birthday\"  \"bday\" \"specialday\" `,
          },
          {
            name: `:smiley:  Happy - Use this when you want to appreciate aeri for her work`,
            value: `> keywords \"happy\" \"joyful\" \"merry\" `,
          },
          {
            name: `:persevere:  Sad - Use this when you / or @someuser is feeling sad. `,
            value: `> keywords: \"sad\" \"big sad\" \"unhappy\" \"dejected\" \"anti-happy\" \"ohayo\" \"wake\" `,
          },
          {
            name: `**Tip**`,
            value: `*Adding the keyword gif to a sentence will make Aeri send you (or a @user in the message) a gif suited to the emotion!`,
          },
        ],
        footer: {
          text: `Made with love by @OptimizedSoda`,
        },
      },
    ],
  });
}

function malHelpResponse(message) {
  message.reply({
    channel_id: `${message.channelId}`,
    content: `${message.author}`,
    tts: false,
    embeds: [
      {
        type: "rich",
        title: ` ~ MyAnimeList Commands ~  `,
        description: `Here are the list of all of Aeri's myAnimeList commands!`,
        color: colors.embededColor,
        fields: [
          {
            name: `:popcorn:  Looking up series (Anime / Manga) `,
            value: `\n> :speech_balloon: *\"Hey Aeri, can you search the series \"Bakemonogatari\" for me?\" \n> :speech_balloon: \"Yo aeri, can you search the series what was it called?... yeah! \"Boku no pico\"? \" `,
            inline: true,
          },
          {
            name: `**NOTE**`,
            value: `\n> - You can use any sentence as long as you include the key words \"aeri\",\"search \n> - Series name is not case sensitive.\n> - Series name must be enclosed inside \" \" for it to work. `,
          },
          {
            name: `:eyes:   **Recommending shows (Anime / Manga)**\n`,
            value: `\n> :speech_balloon: *\"Hey Aeri, can you recommend me a series similar to \"boogie pop phantom\". \" \n> :speech_balloon: *\"i'm looking for series similar to \"haikyuu\" can you recommend me some aeri?\" \n> :speech_balloon: \"Aeri recommend @mentionUser some series similar to his favorite \"Baki\". \"`,
          },
          {
            name: `**NOTE**`,
            value: `\n> - You can use any sentence as long as you include the key words \"aeri\",\"recommend\" \n> - Series name is not case sensitive. \n> - Series name must be enclosed inside \" \" for aeri to detect it. `,
          },
          {
            name: `**:popcorn: ~ Get Watchlist of users from MAL ~**`,
            value: `\n> :speech_balloon: \"Aeri what's on \"OptimizedSoda\"'s Watchlist?\" \n> :speech_balloon: \"Hey aeri, my friend @user has the mal username \"k1r1two\" can you look up his watchlist?\" \n\n> Keyword : \"watchlist *\n> Response: Aeri will return the the top 10 shows from the user's MAL in the > default order. `,
          },
          {
            name: `**Tip**`,
            value: `> Adding the keyword gif to a sentence will make Aeri send you (or a @user in the message) a gif suited to the emotion!`,
          },
        ],
        footer: {
          text: `Made with love by @OptimizedSoda`,
        },
      },
    ],
  });
}

function movieHelpResponse(message) {
  message.reply({
    channel_id: `${message.channelId}`,
    content: `${message.author}`,
    tts: false,
    embeds: [
      {
        type: "rich",
        title: ` ~ Movie Search Commands ~  `,
        description: `Here are the list of all of Aeri's myAnimeList commands!`,
        color: colors.embededColor,
        fields: [
          {
            name: `:popcorn:  Looking up Movies `,
            value: `\n> :speech_balloon: *\"Hey Aeri, movie \"Catch Me if you can\"?\" \n> :speech_balloon: \"Aeri look up the deets of the movie \"catch me if you can\" for @user :D.\" \n> :speech_balloon: *\"Aeri pull up \"catch me if you can\" movie details for everyone!\" `,
            inline: true,
          },
          {
            name: `**NOTE**`,
            value: `\n> - You can use any sentence as long as you include the key words \"aeri\",\"moview\" \n> - Movie name is not case sensitive.\n> - Movie name must be enclosed inside \" \" for it to work. `,
          },
        ],
        footer: {
          text: `Made with love by @OptimizedSoda`,
        },
      },
    ],
  });
}

function musicHelpResponse(message) {
  message.reply({
    channel_id: `${message.channelId}`,
    content: `${message.author}`,
    tts: false,
    embeds: [
      {
        type: "rich",
        title: ` ~ Music Commands ~  `,
        description: `:wave: Hey there! @Sods You can use the following commands to add some tunes right away ;D!`,
        color: colors.embededColor,
        fields: [
          {
            name: `**:arrow_forward: Aeri Play \"songTitle\" - To search and play a music!**`,
            value: "\u200B",
            inline: true,
          },
          {
            name: `**:asterisk: Aeri que \"songTitle\" - To add a song to the que!**\n`,
            value: "\u200B",
          },
          {
            name: `**:pause_button: Aeri pause - To pause the current song!**\n`,
            value: "\u200B",
          },
          {
            name: `**:play_pause: Aeri resume - To resume the current song!**\n`,
            value: "\u200B",
          },
          {
            name: `**:hash: Aeri playlist - To show the current playlist!**\n`,
            value: "\u200B",
          },
          {
            name: `**:stop_button: Aeri leave - To make aeri leave the Voice Channel.**`,
            value: "\u200B",
          },
        ],
        footer: {
          text: `Made with love by @OptimizedSoda`,
        },
      },
    ],
  });
}

var gifCommandList = ["gif", "jif", "sticker", "animatedsticker"];

var greetingHelpCommand = ["greetings", "greeting"];

var specialHelpCommand = ["special", "specials"];

var malHelpCommand = ["myanimelist", "mal"];

var movieHelpCommand = ["moviehelp", "tmdb"];

var moralSupportKeyWordList = ["moral", "morally", "support"];

var musicHelpCommand = ["music", "musichelp"];

var helloKeyWordList = [
  "hello",
  "hi",
  "yo",
  "nihao",
  "konichiwa",
  "moshi",
  "anneonghaseyeo",
  "annyeong",
];

var thanksKeyWordList = [
  "thank",
  "thanks",
  "thank you",
  "appreciate",
  "goodwork",
  "nicework",
  "goodjob",
  "nicejob",
  "arigato",
  "danke",
];

var loveKeyWordList = [
  "love",
  "loves",
  "luv",
  "luvs",
  "aishteru",
  "like",
  "likes",
];

var happyKeyWordList = ["happy", "joyful", "merry"];

var sadKeyWordList = [
  "sad",
  "big sad",
  "unhappy",
  "dejected",
  "anti-happy",
  "cry",
];

var moodKeyWordList = [
  "how",
  "up",
  "what",
  "mood",
  "doing",
  "what are you doing?",
  "how are you?",
  "thought",
  "thoughts",
  "thinking",
];

var byeKeyWordList = [
  "bye",
  "see ya",
  "goodbye",
  "c ya",
  "mata",
  "jane",
  "sayonara",
];

var morningKeyWordList = ["morning", "goodmorning", "ohayō", "ohayo", "wake"];

var nightKeyWordList = [
  "night",
  "goodnight",
  "sleep",
  "sweet dreams",
  "dreams",
  "bed",
  "bedtime",
  "nap",
];

var cheerKeyWordList = [
  "cheer",
  "yay",
  "yipee",
  "woopie",
  "Omedetō",
  "omedeto",
];

var congratulateKeyWordList = [
  "wow",
  "great",
  "super",
  "congrats",
  "congratulate",
  "congratulation",
  "congratulations",
];

var headpatKeyWordList = ["headpat", "head", "pat"];
var birthdayKeyWordList = ["birthday", "bday", "specialday"];
var sorryKeyWordList = ["sorry", "apology", "apologize"];

var helpKeyWordList = [
  "help",
  "commands",
  "command",
  "pannel",
  "chat",
  "let's chat",
  "talk",
  "hey",
];

//###### PRIORITY KEYWORD LIST ########

var keyWordPriorityList = [
  "greeting",
  "special",
  "myanimelist",
  "commandlist",
  "moviehelp",
  "music",
  "gif",
  "birthday",
  "help",
  "love",
  "moral",
  "sorry",
  "thanks",
  "headpat",
  "happyMood",
  "morning",
  "night",
  "congratulate",
  "cheer",
  "sad",
  "happy",
  "bye",
  "hello",
];

//###### KEYWORD LIST ######

var keyWordList = [].concat(
  gifCommandList,
  greetingHelpCommand,
  specialHelpCommand,
  musicHelpCommand,
  malHelpCommand,
  movieHelpCommand,
  loveKeyWordList,
  moralSupportKeyWordList,
  helloKeyWordList,
  thanksKeyWordList,
  happyKeyWordList,
  sadKeyWordList,
  byeKeyWordList,
  moodKeyWordList,
  congratulateKeyWordList,
  morningKeyWordList,
  nightKeyWordList,
  cheerKeyWordList,
  headpatKeyWordList,
  birthdayKeyWordList,
  sorryKeyWordList,
  helpKeyWordList
);

var emotionMapDict = {
  love: loveKeyWordList,
  music: musicHelpCommand,
  gif: gifCommandList,
  greeting: greetingHelpCommand,
  special: specialHelpCommand,
  myanimelist: malHelpCommand,
  moviehelp: movieHelpCommand,
  hello: helloKeyWordList,
  bye: byeKeyWordList,
  thanks: thanksKeyWordList,
  happy: happyKeyWordList,
  moral: moralSupportKeyWordList,
  sad: sadKeyWordList,
  happyMood: moodKeyWordList,
  congratulation: congratulateKeyWordList,
  morning: morningKeyWordList,
  night: nightKeyWordList,
  cheer: cheerKeyWordList,
  headpat: headpatKeyWordList,
  birthday: birthdayKeyWordList,
  sorry: sorryKeyWordList,
  help: helpKeyWordList,
};

//### EMOTION RESPONSE DICT #####

var emotionResponseDict = {
  love: [
    "I will always love you.",
    "I am here for you…always",
    "I’d do anything to make you smile",
    "My love for you is unconditional and eternal.",
    "Awww thank you :3 Aeri loves you too!",
    "Awww thank you :3 Aeri likes you too!",
  ],
  gif: [
    "Hold up! I'm searching one right now!! :D!!",
    "Aye Aye senpai! :heart:",
    "tenor here i come!",
  ],
  music: null,
  greeting: null,
  special: null,
  myanimelist: null,
  moviehelp: null,
  help: null,

  moral: [
    "You will die alone and you will be happy.",
    "If you think your day sucked - tomorrow is yet to come.",
    "This world is full of people way more attractive, deserving and talented then you.",
    "The world doesn't exist to please you. You're not it's center.",
  ],

  headpat: [
    "There there.",
    "Coming up!",
    "Awww there you go!",
    "Everything will be fine :>!",
  ],
  hello: [
    "Hello back! :D!",
    "I was just thinking about you! :heart:",
    "Hello there :D! How has been your day so far?",
  ],
  happy: ["Aeri is also happy for you! :D!!!", "OMG UWUWUWU"],
  sad: [
    "Don't be sad!!! it'll work out! Aeri trusts you!! :>>>",
    "Don't worry I'm here for you!",
    "It'll all work out in the end Because Aeri knows you are a nice person :>)",
  ],
  thanks: ["Don't mention it! ;D!!", "That's what I'm here for!", "Rawwwrr ;3"],
  happyMood: [
    "Oh I've been doing great! How are things at your end?",
    "Was just thinking about you ;>",
    "I was looking up the wikipedia for pancakes ~",
    "I'm working hard on understanding human emotions!",
    "I'm replicating the activity of systematically delaying my algorithmic tasks and justifying them with clever uses of semantics the same way my creator does! :> How are you btw?",
  ],
  congratulation: [
    "Nice work!",
    "I knew you could do it!",
    "UwU YAY!!!",
    "Here's to your success!",
    "Cheers! :beers:",
  ],
  bye: [
    "OHH NO! ;( are you leaving already?",
    "I see... ;<",
    "Good bye ;D I will always be waiting for you here!",
  ],
  cheer: ["You can do it Aeri trusts you! :heart:", "I'm rooting for you. :D"],
  night: [
    "I wish you have happy dreams!",
    "Aeri wishes you a warm and good night! :>)",
  ],
  morning: [
    "Have a pleasant day!",
    "Good morning to you too! I was just thinking about you!",
  ],
  sorry: [
    //"I'm sorry! I don't seem to have the response for this emotion right now. ;-; \nIf you want me to feel this emotion please contact my creator. \n\n**Discord**: *@OptimizedSoda* \n**Website**: **https://quib.dev/Aeri**\n**Github: https://github.com/quibdev/aeri** \n\n**PS.** *You know my creator Made me open source :D? If you want. You can add those emotions to me! Just fork me on github!*",
    "Sorry :] I have no idea what you just said. If this is a bug please report it to my creator here! https://discord.gg/smpycPGcj7",
  ],
  birthday: Responses.happyBirthdayWishes,
};

module.exports = {
  emotionResponseDict,
  keyWordList,
  emotionMapDict,
  keyWordPriorityList,
  helpCommandResponse,
  greetingHelpResponse,
  specialHelpResponse,
  malHelpResponse,
  movieHelpResponse,
  musicHelpResponse,
};
