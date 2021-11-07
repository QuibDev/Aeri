// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");
const {
  TenorGifSearch,
  getResponse,
  getEmotion,
  searchSeries,
  recommendSeries,
} = require("./functions/Commands");
const Data = require("./data/emotions");

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
});

// When the client is ready, run this code (only once)
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const onMessage = async () => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return false; // Terminate if the message is from a bot

    messageContent = message.content // clean the message before analysing
      .toLowerCase()
      .replaceAll("!", "")
      .replaceAll("?", "")
      .replaceAll("*", "")
      .replaceAll("#", "");

    if (messageContent.split(" ").includes("aeri")) {
      // search for trigger word "aeri"

      if (messageContent.match("(<@.*?>)")) {
        var user = messageContent.match("(<@.*?>)")[0];

        console.log("mentioned user: ", user);
      } else {
        var user = "<@" + message.author.id + ">";
      }

      if (messageContent.split(" ").includes("search")) {
        message.reply(`Wait, I'll look it up on MAL for you :D! ${user}`);

        query = messageContent
          .match(/"(.*?)"/g)
          .toString()
          .replaceAll('"', "");

        console.log("searching query: ", query);
        await searchSeries(query).then((series) => {
          if (
            series.payload.status.toString().toLowerCase() === "finished airing"
          ) {
            message.reply(
              `I found the ${series.type} ${series.name} on My Anime List! It's rated ${series.payload.score} and originally aired between ${series.payload.aired}`
            );
          } else {
            message.reply(
              `I found the ${series.type} ${series.name} on My Anime List! It's rated ${series.payload.score} and is currently airing this season!`
            );
          }
          message.channel.send("Here check it out!" + " " + user);
          message.channel.send(series.url);
        });
      } else if (messageContent.split(" ").includes("recommend")) {
        query = messageContent
          .match(/"(.*?)"/g)
          .toString()
          .replaceAll('"', "");

        message.reply(
          `Hmmm, A series similar to ${query} huh? Wait I'll look it up on MAL! :D! ${user}`
        );

        console.log("recommendation query: ", query);
        await recommendSeries(query).then((series) => {
          message.reply(
            `How about checking out ${series.anime}? I read it's reviews on MAL and most people think it has the same charm!`
          );
          message.channel.send(`Here check it out! ${user}`);
          message.channel.send(series.animeLink);
        });
      } else {
        console.log(
          `Message from ${message.author.username}: ${messageContent}`
        ); // DEBUG [LOG THE COMMAND MESSAGE]

        var emotion = getEmotion(message);
        var response = getResponse(emotion, user);

        await message.reply(`${response} ${user}`);

        if (messageContent.split(" ").includes("gif")) {
          await TenorGifSearch(emotion).then((gif) => {
            message.channel.send(`This one's for you! ${user}`);
            message.reply(`${gif}`);
          });
        }
      }
    }
  });
};

onMessage();

// Login to Discord with your client's token
client.login(token);
