// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");
const { musicKeywords } = require("./data/musicKeyword");

const {
  initContext,
  helpCommand,
  queueCommand,
  playCommand,
  playlistCommand,
  pauseCommand,
  skipCommand,
  resumeCommand,
  leaveCommand,
} = require("./functions/MusicCommands");

const {
  TenorGifSearch,
  getResponse,
  getEmotion,
  searchSeries,
  recommendSeries,
  getWatchList,
  initCommandContext,
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
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// When the client is ready, run this code (only once)
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Type "Hey Aeri" to start chatting!');
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
      if (messageContent.match("(<@.*?>)")) {
        var user = messageContent.match("(<@.*?>)")[0];

        console.log("mentioned user: ", user);
      } else {
        var user = "<@" + message.author.id + ">";
      }

      var musicCommand = null;

      musicKeywords.some((v) => {
        if (messageContent.includes(v)) {
          musicCommand = v;
        }
      });

      console.log("command: ", musicCommand);

      // aeri music commands

      if (messageContent.split(" ").includes("watchlist")) {
        if (messageContent.match(/"(.*?)"/g)) {
          query = messageContent
            .match(/"(.*?)"/g)
            .toString()
            .replaceAll('"', "");

          message.reply(
            `Pulling up the watchlist of ${query} from MAL! :D! ${user}`
          );

          console.log("watchlist user: ", query);

          await getWatchList(query).then((series) => {
            message.channel.send(
              `Here are the compiled list of the top ten shows that I found! ${user}`
            );

            var watchList;

            for (let i = 0; i < 10; i++) {
              if (series[i].score) {
                watchList += `\n ${i + 1}. ${series[i].animeTitle} - *Scored ${
                  series[i].score
                }*`;
              } else {
                watchList += `\n ${i + 1}. ${series[i].animeTitle} - *Scored ${
                  series[i].score
                }*`;
              }
            }

            message.channel.send(
              `${watchList} \n\n**PS!** If you want me to look up the deets of one of the series for you just ask me with aeri search "series name"! :D ${user}`
            );
          });
        } else {
          message.reply(":]");
          message.reply("I'm sorry I can't find this user on MAL!");
          message.channel.send(
            `Actually, ${user} you need to include the user's name under " " for me to look it up!`
          );
        }
      } else if (messageContent.split(" ").includes("search")) {
        message.channel.sendTyping();
        await new Promise((r) => setTimeout(r, 1000));
        message.reply(`Wait, I'll look it up on MAL for you :D! ${user}`);

        if (messageContent.match(/"(.*?)"/g)) {
          query = messageContent
            .match(/"(.*?)"/g)
            .toString()
            .replaceAll('"', "");

          console.log("searching query: ", query);
          await searchSeries(query)
            .then((series) => {
              if (
                series.payload.status.toString().toLowerCase() ===
                "finished airing"
              ) {
                message.reply(
                  `I found the ${series.type} ${series.name} on My Anime List! It's rated **${series.payload.score} / 10** and originally aired between ${series.payload.aired}`
                );
              } else {
                message.reply(
                  `I found the ${series.type} ${series.name} on My Anime List! It's rated **${series.payload.score} / 10** and is currently airing this season!`
                );
              }
              message.channel.send("Here check it out!" + " " + user);
              message.channel.send(series.url);
            })
            .catch((error) => {
              message.reply(":]");
              message.reply("I'm sorry I can't find the show on MAL!");
              message.channel.send(
                `Maybe try changing the spelling a bit! And remember to add them under double quotations (" ")! I can't find the show otherwise! ${user}`
              );
            });
        } else {
          message.channel.sendTyping();
          await new Promise((r) => setTimeout(r, 1000));
          message.reply(":]");
          message.reply("I'm sorry I can't find this show on MAL!");
          message.channel.send(
            `Actually, ${user} you need to include the series name under " " for me to look it up!`
          );
        }
      } else if (messageContent.split(" ").includes("recommend")) {
        if (messageContent.match(/"(.*?)"/g)) {
          query = messageContent
            .match(/"(.*?)"/g)
            .toString()
            .replaceAll('"', "");

          message.reply(
            `Hmmm, A series similar to ${query} huh? Wait I'll look it up on MAL! :D! ${user}`
          );

          console.log("recommendation query: ", query);
          await recommendSeries(query)
            .then((series) => {
              message.reply(
                `How about checking out ${series.anime}? I read it's reviews on MAL and most people think it has the same charm!`
              );
              message.channel.send(`Here check it out! ${user}`);
              message.channel.send(series.animeLink);
            })
            .catch((error) => {
              message.reply(":]");
              message.reply("I'm sorry I can't find this show on MAL!");
              message.channel.send(
                `Maybe try changing the spelling a bit! And remember to add them under double quotations (" ")! I can't find the show otherwise! ${user}`
              );
            });
        } else {
          message.reply(":]");
          message.reply("I'm sorry I can't find this show on MAL!");
          message.channel.send(
            `Actually, ${user} you need to include the series name under " " for me to look it up!`
          );
        }
      } else if (musicCommand) {
        initContext(message);

        switch (musicCommand) {
          case "play":
            console.log("\ntriggered play music\n");
            playCommand();
            break;

          case "que":
            console.log("\ntriggered queue music\n");
            queueCommand();
            break;

          case "musichelp":
            console.log("\ntriggered help music\n");
            helpCommand();
            break;

          case "pause":
            console.log("\ntriggered pause music\n");
            pauseCommand();
            break;

          case "resume":
            console.log("\ntriggered resume music\n");
            resumeCommand();
            break;

          case "skip":
            console.log("\ntriggered skip music\n");
            skipCommand();
            break;

          case "playlist":
            console.log("\ntriggered playlist music\n");
            playlistCommand();
            break;

          case "leave":
            console.log("\ntriggered leave music\n");
            leaveCommand();
            break;

          default:
            break;
        }
      } else {
        var emotion = getEmotion(message);

        switch (emotion) {
          case "help":
            Data.helpCommandResponse(message);
            break;

          case "greeting":
            Data.greetingHelpResponse(message);
            break;

          case "special":
            Data.specialHelpResponse(message);
            break;

          case "myanimelist":
            Data.malHelpResponse(message);
            break;

          case "music":
            Data.musicHelpResponse(message);
            break;
        }

        var response = getResponse(emotion, user);

        if (response) {
          message.channel.sendTyping();
          await new Promise((r) => setTimeout(r, 1000));

          await message.reply(`${response} ${user}`);

          if (messageContent.split(" ").includes("gif")) {
            // searching for custom gifs

            if (messageContent.match(/"(.*?)"/g)) {
              query = messageContent
                .match(/"(.*?)"/g)
                .toString()
                .replaceAll('"', "");

              if (query) {
                console.log("searching custom gif query: ", query);
                await TenorGifSearch(query, (custom = true))
                  .then((gif) => {
                    message.channel.sendTyping();
                    message.channel.send(`This one's for you! ${user}`);
                    message.reply(`${gif}`);
                  })
                  .catch((error) => {
                    message.channel.sendTyping();
                    message.reply(":]");
                    message.reply("I'm sorry I can't find this gif on Tenor!");
                    message.channel.send(
                      `Maybe try changing the spelling a bit! And remember to add them under double quotations (" ")! Aeri can't find the gif otherwise! ${user}`
                    );
                  });
              } else {
                message.channel.sendTyping();
                await new Promise((r) => setTimeout(r, 1000));
                message.reply(":]");
                message.reply(
                  'You know you have to actually include something inside those " " I can\'t search empty gifs!!'
                );
                message.channel.send(`*...not yet anyways*`);
              }
            }

            // searching for gifs based on message
            else {
              if (emotion != "gif") {
                await TenorGifSearch(emotion).then((gif) => {
                  message.channel.send(`This one's for you! ${user}`);
                  message.reply(`${gif}`);
                });
              } else {
                message.channel.sendTyping();
                await new Promise((r) => setTimeout(r, 1000));
                message.reply(":]");
                message.channel.sendTyping();
                await new Promise((r) => setTimeout(r, 1000));
                message.reply("Wait send gifs about what? :<");
                await new Promise((r) => setTimeout(r, 500));
                message.channel.send(`*Aeri is dumb`);
                await new Promise((r) => setTimeout(r, 500));
                message.reply(
                  `Aeri can't detect any emotions in this message :<<<`
                );
                await new Promise((r) => setTimeout(r, 100));
                message.channel.send(
                  `Please try again! Do you know you can ask aeri to search custom gifs by including their names inside \"quotations\" :D?`
                );
              }
            }
          }
        }
      }
    }
  });
};

onMessage();

// Login to Discord with your client's token
client.login(token);
