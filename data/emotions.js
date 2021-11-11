const Responses = require("../data/Responses.json");

//###### KEYWORD LIST ######

//"intro": {
//  "content": "👋 Hey there! My name is Aeri! **[Artifical Emotion Response Interchange]**. To get started, here are a few things I can do!",
//  "tts": false,
//  "embeds": [
//    {
//      "type": "rich",
//      "title": "Aeri Commands!",
//      "description": "🙌 **Aeri Greetings** To check out the list of my greeting commands!\n\n😊  **Aeri Specials** To check out the list of my special commands!\n\n🍿  **Aeri MyAnimeList** To check out the list of my MAL commands! \n",
//      "color": "0xff5974"
//    }
//  ]
//},

var gifCommandList = ["gif", "jif", "sticker", "animatedsticker"];

var greetingHelpCommand = ["greetings", "greeting"];

var specialHelpCommand = ["special", "specials"];

var malHelpCommand = ["myanimelist", "mal"];

var helloKeyWordList = ["hello", "hi", "yo", "nihao", "konichiwa", "moshi"];

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
  "gif",
  "birthday",
  "help",
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
  malHelpCommand,
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
  gif: gifCommandList,
  greeting: greetingHelpCommand,
  special: specialHelpCommand,
  myanimelist: malHelpCommand,
  hello: helloKeyWordList,
  bye: byeKeyWordList,
  thanks: thanksKeyWordList,
  happy: happyKeyWordList,
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
  gif: [
    "Hold up! I'm searching one right now!! :D!!",
    "Aye Aye senpai! :heart:",
    "tenor here i come!",
  ],
  greeting: [Responses.greetingsHelp],
  special: [Responses.specialsHelp],
  myanimelist: [Responses.myAnimeListHelp],
  help: [Responses.intro],
  headpat: ["There there.", "Coming up!", "Awww there you go!"],
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
    //"I'm sorry! I don't seem to have the response for this emotion right now. ;-; \nIf you want me to feel this emotion please contact my creator. \n\n**Discord**: *@OptimizedSoda* \n**Website**: **https://quib.dev/Aeri**\n**Github: https://github.com/quibdev/aeri** \n\n**PS.** *You know my creator made me open source :D? If you want. You can add those emotions to me! Just fork me on github!*",
    "Sorry :] I have no idea what you just said. If this is a bug please report it to my creator here! https://discord.gg/smpycPGcj7",
  ],
  birthday: Responses.happyBirthdayWishes,
};

module.exports = {
  emotionResponseDict,
  keyWordList,
  emotionMapDict,
  keyWordPriorityList,
};
