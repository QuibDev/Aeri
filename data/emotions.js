//##### THE GET HELP RESPONSE #####
var intro =
  "\n :sparkles: Hi! I'm Aeri! **[Artificial Emotion Response Interchange]** created by my creator Soda-Senpai! :heart: to spread happy emotions!\n";
var purpose =
  "\n:question: **My purpose** - as was told by my creator - is to convert human emotions into cute and friendly gifs! which you can favorite and share with your friends! Try it out! You might find gifs that you didn't knew existed!\n";
var use = "\n:point_right: **Here's what you can use me for!**\n";
var help =
  "\n:face_with_spiral_eyes: **Aeri help** - *this brings up my command help menu.*";

var intro = intro + purpose + use + help;

var greetings1 =
  "\n:wave: **Aeri Hello** - *Use this when you want to say hi to me!*";
var greetings2 =
  "\n:wave: **Aeri Bye** - *Use this when you want to say your good bye greeting to me. :(*";
var greetings3 =
  "\n:sunny: **Aeri Morning** - *use this when you want to wish good morning to Aeri!*";
var greetings4 =
  "\n:last_quarter_moon_with_face: **Aeri night**- u*se this when you want to wish Aeri good night!*";

var greetings = greetings1 + greetings2 + greetings3 + greetings4;

var specials1 =
  "\n:blush: **Aeri headpat** - *Use this when you feel down and need a headpat from Aeri!*";
var specials2 =
  "\n:thought_balloon: **Aeri Thoughts** - Use this to ask aeri what she's upto!";
var specials3 =
  "\n:partying_face: **Aeri Congratulate** - Use this when you want aeri to congratulate yourself or someone in the server!";
var specials4 =
  "\n:clap: **Aeri cheer** - *Use this when you want Aeri to cheer you up!*";
var specials5 =
  "\n:birthday: **Aeri wish [@user] happy birthday!** - *Use this when you want Aeri to wish a person happy birthday!*";

var specials = specials1 + specials2 + specials3 + specials4 + specials5;

var outro =
  "\n**Discord:** https://discord.gg/RvHyYD8Ew5 \n**Website:** https://quib.dev/Aeri \n**Github:** https://github.com/quibdev/aeri  \n\n**PS.** *You know my creator made me open source :D? If you want. You can add those emotions to me! Just fork me on github!*";

var helpResponse =
  intro +
  "\n\n** ~ Greetings ~ **" +
  greetings +
  "\n\n**~ Specials ~**" +
  specials +
  "\n\n" +
  outro;

//### EMOTION RESPONSE DICT #####

var happyBirthdayWishes = [
  "Count your life by smiles, not tears. Count your age by friends, not years. Happy birthday!",
  "“Happy birthday! I hope all your birthday wishes and dreams come true.”",
  "“A wish for you on your birthday, whatever you ask may you receive, whatever you seek may you find, whatever you wish may it be fulfilled on your birthday and always. Happy birthday!”",
  "“ Another adventure filled year awaits you. Welcome it by celebrating your birthday with pomp and splendor. Wishing you a very happy and fun-filled birthday!”",
  "“May the joy that you have spread in the past come back to you on this day. Wishing you a very happy birthday!”",
  "“Happy birthday! Your life is just about to pick up speed and blast off into the stratosphere. Wear a seat belt and be sure to enjoy the journey. Happy birthday!”",
  "“This birthday, I wish you abundant happiness and love. May all your dreams turn into reality and may lady luck visit your home today. Happy birthday to one of the sweetest people I’ve ever known.”",
  "“May you be gifted with life’s biggest joys and never-ending bliss. After all, you yourself are a gift to earth, so you deserve the best. Happy birthday.”",
  "“Count not the candles…see the lights they give. Count not the years, but the life you live. Wishing you a wonderful time ahead. Happy birthday.”",
  "“Forget the past; look forward to the future, for the best things are yet to come.”",
  "“Birthdays are a new start, a fresh beginning and a time to pursue new endeavors with new goals. Move forward with confidence and courage. You are a very special person. May today and all of your days be amazing!”",
  "“Your birthday is the first day of another 365-day journey. Be the shining thread in the beautiful tapestry of the world to make this year the best ever. Enjoy the ride.”",
  "“Be happy! Today is the day you were brought into this world to be a blessing and inspiration to the people around you! You are a wonderful person! May you be given more birthdays to fulfill all of your dreams!”",
];

var emotionResponseDict = {
  help: [helpResponse],
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
    "I'm sorry! I don't seem to have the response for this emotion right now. ;-; \nIf you want me to feel this emotion please contact my creator. \n\n**Discord**: *@OptimizedSoda* \n**Website**: **https://quib.dev/Aeri**\n**Github: https://github.com/quibdev/aeri** \n\n**PS.** *You know my creator made me open source :D? If you want. You can add those emotions to me! Just fork me on github!*",
    "Sorry :] I have no idea what you just said. If this is a bug please report it to my creator here! https://discord.gg/smpycPGcj7",
  ],
  birthday: happyBirthdayWishes,
};

//###### KEYWORD LIST ######

var helloKeyWordList = [
  "hello",
  "hi",
  "hey",
  "yo",
  "nihao",
  "konichiwa",
  "moshi",
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

var happyKeyWordList = ["happy", "joyful", "merry"];

var sadKeyWordList = ["sad", "big sad", "unhappy", "dejected", "anti-happy"];

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
  "pannel",
  "chat",
  "let's chat",
  "talk",
];

//###### PRIORITY KEYWORD LIST ########

var keyWordPriorityList = [
  "birthday",
  "help",
  "sorry",
  "thanks",
  "headpat",
  "mood",
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

module.exports = {
  helpResponse,
  emotionResponseDict,
  keyWordList,
  emotionMapDict,
  keyWordPriorityList,
};
