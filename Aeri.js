// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");
const { musicKeywords } = require("./data/musicKeyword");
const malScraper = require("mal-scraper");

const {
  initMusicCommandContext,
  helpCommand,
  queueCommand,
  playCommand,
  playlistCommand,
  pauseCommand,
  pauseUnpauseCommand,
  skipCommand,
  resumeCommand,
  leaveCommand,
  clearPlaylistCommand,
  prevCommand,
  loopCommand,
} = require("./functions/MusicCommands/MusicCommands");

const { setGuildData } = require("./functions/Context.js");

const {
  TenorGifSearch,
  getResponse,
  getEmotion,
  searchSeries,
  recommendSeries,
  getTmdbResults,
  getWatchList,
  getCharacterInfo,
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

    if (
      messageContent.split(" ").includes("<@905305635745316885>") ||
      messageContent.split(" ").includes("aeri") ||
      messageContent.split(" ").includes("@aeri")
    ) {
      console.log("\nSETTING CONTEXT");
      setGuildData(message);
      initCommandContext(message.guildId);
      initMusicCommandContext(message.guildId);
      console.log("\nUPDATED CONTEXT");

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

      // aeri movie commands

      if (
        messageContent.split(" ").includes("movie") ||
        messageContent.split(" ").includes("movies")
      ) {
        message.channel.sendTyping();
        await new Promise((r) => setTimeout(r, 1000));
        message.reply(
          `Wait, I'll look it up on The Movie Database for you :D! ${user}`
        );

        if (messageContent.match(/"(.*?)"/g)) {
          let queried = messageContent
            .match(/"(.*?)"/g)
            .toString()
            .replaceAll('"', "");

          console.log("searching queried: ", queried);
          await getTmdbResults(queried);
        } else {
          message.channel.sendTyping();
          await new Promise((r) => setTimeout(r, 1000));
          message.reply(":]");
          message.reply(
            "I'm sorry I can't find this show on The Movie Database!"
          );
          message.channel.send(
            `Actually, ${user} you need to include the series name under " " for me to look it up!`
          );
        }
      }

      // aeri anime commands
      else if (messageContent.split(" ").includes("watchlist")) {
        if (messageContent.match(/"(.*?)"/g)) {
          let queried = messageContent
            .match(/"(.*?)"/g)
            .toString()
            .replaceAll('"', "");

          message.reply(
            `Pulling up the watchlist of ${queried} from MAL! :D! ${user}`
          );

          console.log("watchlist user: ", queried);

          await getWatchList(queried).then((series) => {
            message.channel.send(
              `Here are the compiled list of the top ten shows that I found! ${user}`
            );

            if (series) {
              var watchList = "";
              for (let i = 0; i < 10; i++) {
                try {
                  if (series[i]) {
                    watchList += `\n ${i + 1}. ${
                      series[i].animeTitle
                    } - *Scored ${series[i].score}*`;
                  }
                } catch {
                  watchList += `\n ${i + 1}. ${series[i].animeTitle}`;
                }
              }
              message.reply(
                `Here is the watchlist of ${queried} in default order! \n\n ${watchList} \n\n **PS. If you want aeri to look up one of these shows deets just hit me up with a *aeri search "showTitle"*!`
              );
            } else {
              message.reply(":]");
              message.reply("I'm sorry I can't find this user on MAL!");
              message.channel.send(
                `Actually, ${user} you need to include the user's name under " " for me to look it up!`
              );
            }
          });
        }
      } else if (
        messageContent.split(" ").includes("character") ||
        messageContent.split(" ").includes("characters")
      ) {
        console.log("\nTriggered character search");

        if (messageContent.match(/"(.*?)"/g)) {
          let queried = messageContent
            .match(/"(.*?)"/g)
            .toString()
            .replaceAll('"', "");

          console.log("searching queried: ", queried);
          await getCharacterInfo(queried);
        }
      } else if (messageContent.split(" ").includes("anime")) {
        message.channel.sendTyping();
        await new Promise((r) => setTimeout(r, 1000));
        message.reply(`Wait, I'll look it up on MAL for you :D! ${user}`);

        if (messageContent.match(/"(.*?)"/g)) {
          let queried = messageContent
            .match(/"(.*?)"/g)
            .toString()
            .replaceAll('"', "");

          console.log("searching queried: ", queried);
          await searchSeries(queried);
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
          let queried = messageContent
            .match(/"(.*?)"/g)
            .toString()
            .replaceAll('"', "");

          message.reply(
            `Hmmm, A series similar to ${queried} huh? Wait I'll look it up on MAL! :D! ${user}`
          );

          console.log("recommendation queried: ", queried);
          await recommendSeries(queried)
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
      }

      // aeri music commands
      else if (musicCommand) {
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

          case "previous":
            console.log("\ntriggered previous music\n");
            prevCommand();
            break;

          case "prev":
            console.log("\ntriggered previous music\n");
            prevCommand();
            break;

          case "loop":
            console.log("\ntriggered loop music\n");
            loopCommand();
            break;

          case "clear":
            console.log("\ntriggered clearplaylist music\n");
            clearPlaylistCommand();
            break;

          case "quelist":
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

          case "moviehelp":
            Data.movieHelpResponse(message);
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

          if (true /*messageContent.split(" ").includes("gif")*/) {
            // searching for custom gifs

            if (messageContent.match(/"(.*?)"/g)) {
              let queried = messageContent
                .match(/"(.*?)"/g)
                .toString()
                .replaceAll('"', "");

              if (queried) {
                console.log("searching custom gif queried: ", queried);
                await TenorGifSearch(queried, (custom = true))
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
                  if (gif) {
                    message.channel.send(`This one's for you! ${user}`);
                    message.reply(`${gif}`);
                  }
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

client.on("interactionCreate", (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "charactersInfoMAL") {
    // get the show url from the previous message.
    // pass it in

    async function getCharacterInteraction() {
      try {
        console.log("searching characters from: ", context.query);
        await malScraper.getInfoFromName(context.query).then((show) => {
          getCharacterInfo(show);
        });
      } catch {
        (e) => console.log(e);
      }
    }

    getCharacterInteraction();
  } else if (interaction.customId === "similarShowsMAL") {
    async function getRecommendationInteraction() {
      try {
        console.log("recommending series related to: ", context.query);
        await recommendSeries(context.query).then((show) => {
          //console.log(show);
          searchSeries(show.anime);
        });
        //searchSeries(recommendSeries(context.query).name);
      } catch {
        (e) => {
          console.log(e);
        };
      }
    }
    getRecommendationInteraction();
  }

  // music command buttons
  else if (interaction.customId === "previousTrackButton") {
    prevCommand();
  } else if (interaction.customId === "pauseTrackButton") {
    pauseUnpauseCommand();
  } else if (interaction.customId === "nextTrackButton") {
    skipCommand();
  } else if (interaction.customId === "loopTrackButton") {
    loopCommand();
  } else if (interaction.customId === "nextPlaylistPageButton") {
    playlistCommand((nextPage = true));
  } else if (interaction.customId === "nextPlaylistPageButton") {
    playlistCommand((previousPage = true));
  }
});

onMessage();

// Login to Discord with your client's token
client.login(token);
