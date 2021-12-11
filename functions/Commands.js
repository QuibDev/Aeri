// commands.js

const Data = require("../data/emotions");
const malScraper = require("mal-scraper");
const colors = require("../data/colors.json");
const { getGuildData } = require("./Context");

var context = null;

function initCommandContext(guildId) {
  context = getGuildData(guildId);
}

async function getCharacterInfo(query) {
  try {
    for (let i = 0; i < query.characters.length; i++) {
      context.message.reply({
        channel_id: `${context.user.channelID}`,
        content: `${context.user}`,
        tts: false,
        embeds: [
          {
            type: "rich",
            title: `${query.characters[i].name}`,
            description: `**Role**: ${query.characters[i].role}\n**Seiyuu**: ${query.characters[i].seiyuu.name}`,
            color: colors.embededColor,
            thumbnail: {
              url: `${query.characters[i].picture}`,
              height: 0,
              width: 0,
            },
            url: `${query.characters[i].link}`,
          },
        ],
      });
    }
  } catch {
    context.message.channel.sendTyping();
    await new Promise((r) => setTimeout(r, 1000));
    context.message.reply(
      `Aye, Aye! Aeri will look them up on MAL for you :D! ${context.user}`
    );
    await new Promise((r) => setTimeout(r, 1000));

    await malScraper.getInfoFromName(query).then((show) => {
      for (let i = 0; i < show.characters.length; i++) {
        context.message.reply({
          channel_id: `${context.user.channelID}`,
          content: `${context.user}`,
          tts: false,
          embeds: [
            {
              type: "rich",
              title: `${show.characters[i].name}`,
              description: `**Role**: ${show.characters[i].role}\n**Seiyuu**: ${show.characters[i].seiyuu.name}`,
              color: colors.embededColor,
              thumbnail: {
                url: `${show.characters[i].picture}`,
                height: 0,
                width: 0,
              },
              url: `${show.characters[i].link}`,
            },
          ],
        });
      }
    });
  }
}

async function getSeriesInfo(data) {
  await malScraper.getInfoFromURL(data.url).then((show) => {
    context.message.reply({
      channel_id: `${context.user.channelID}`,
      content: `${context.user}`,
      tts: false,
      components: [
        {
          type: 1,
          components: [
            {
              style: 1,
              label: `Characters`,
              custom_id: `charactersInfoMAL`,
              disabled: false,
              type: 2,
            },
            {
              style: 1,
              label: `Similar `,
              custom_id: `similarShowsMAL`,
              disabled: false,
              type: 2,
            },
            {
              style: 5,
              label: `More Info`,
              url: `${data.url}`,
              disabled: false,
              type: 2,
            },
          ],
        },
      ],
      embeds: [
        {
          type: "rich",
          title: `${show.title}`,
          description: `\n ${
            show.synopsis.split("\n")[0]
          } \n\n:hourglass_flowing_sand: **Status**           :dividers: **Type**           :calendar_spiral: **Aired** \n${
            show.status
          }           ${data.type}           ${
            show.premiered
          } \n\n :stopwatch: **duration**           :star: **Average Rating**                           :trophy: **Ranked** \n${
            show.duration
          }                     ${show.score}/10                         top ${
            show.ranked
          }`,
          color: colors.embededColor,
          thumbnail: {
            url: `${show.picture}`,
            height: 350,
            width: 350,
          },
        },
      ],
    });
  });
}

async function searchSeries(series) {
  return malScraper
    .getResultsFromSearch(series)
    .then((data) => {
      //console.log(data[0]);
      getSeriesInfo(data[0]);
    })
    .catch((err) => console.log(err));
}

function getSeriesLength(series, id) {
  return malScraper
    .getEpisodesList({
      name: series,
      id: id,
    })
    .then((data) => {
      return data.length;
    })
    .catch((err) => console.log(err));
}

async function getTmdbResults(series) {
  const { TMDB_API_KEY } = require("../config.json");
  const mdb = require("moviedb")(TMDB_API_KEY);

  mdb.searchMovie({ query: series }, (err, res) => {
    show = null;
    try {
      show = res.results[0];
    } catch {
      context.message.reply(":]");
      context.message.reply(
        "I'm sorry I can't find this show on The Movie Database!"
      );
      context.message.channel.send(
        `Hey, ${context.user} Maybe try changing the name of the movie a bit?`
      );
      context.message.channel.send(
        `If I can't find it again, then it's possible poor folks don't have it indexed ;0;`
      );
    }
    if (show) {
      console.log(res.results[0]);
      show = res.results[0];
      context.message.reply({
        channel_id: `${context.user.channelID}`,
        content: `${context.user}`,
        tts: false,
        embeds: [
          {
            type: "rich",
            title: `${show.title}`,
            description: `\n\n:calendar_spiral: **Released** ${
              show.release_date
            }     \n\n ${show.overview.split("\n")[0]} \n\n:star: **Rating** ${
              show.vote_average
            }/10 | :speaker:  **Language** ${show.original_language}`,
            color: colors.embededColor,
            image: {
              url: `${"https://image.tmdb.org/t/p/w500/" + show.backdrop_path}`,
              height: 0,
              width: 0,
            },
            thumbnail: {
              url: `${"https://image.tmdb.org/t/p/w500/" + show.poster_path}`,
              height: 350,
              width: 350,
            },
          },
        ],
      });
    }
  });
}

//console.log(`series: ${getTmdbResults("danish girl")}`);

async function recommendSeries(series) {
  return malScraper
    .getRecommendationsList(series)
    .then((data) => {
      return data[0];
    })
    .catch((err) => console.log(err));
}

function getWatchList(user, limit = 10, type = "anime") {
  //"Hey aeri, what shows are on the watchlisconst malScraper = require('mal-scraper')
  const malScraper = require("mal-scraper");

  const username = user;
  const after = 0;

  // Get you an object containing all the entries with status, score... from this user's watch list
  return malScraper
    .getWatchListFromUser(username, after, type)
    .then((data) => {
      const slicedData = data.slice(0, limit);
      //console.log(slicedData[0].score);
      return slicedData;
    })
    .catch((err) => console.log(err));
}

function TenorGifSearch(emotion, custom = false) {
  if (!custom) var emotion = "anime" + emotion;

  const { TENOR_API_KEY } = require("../config.json");

  const Tenor = require("tenorjs").client({
    Key: TENOR_API_KEY, // https://tenor.com/developer/keyregistration
    Filter: "off", // "off", "low", "medium", "high", not case sensitive
    Locale: "en_US", // Your locale here, case-sensitivity depends on input
    MediaFilter: "minimal", // either minimal or basic, not case sensitive
    DateFormat: "D/MM/YYYY - H:mm:ss A", // Change this accordingly
  });

  var randomInt = Math.floor(Math.random() * 15);

  return Tenor.Search.Query(emotion, "15")
    .then((data) => {
      return data[randomInt].url;
    })
    .catch((err) => console.log(err));
}

function getResponse(emotion) {
  var response = null;
  var gif = null;
  var randomFloat = Math.random();

  if (!(emotion in Data.emotionResponseDict)) {
    emotion = "sorry";
  }

  const responseArray = Data.emotionResponseDict[emotion];
  if (responseArray) {
    response = responseArray[Math.floor(randomFloat * responseArray.length)];
  }

  //console.log("getResponse: ", response);
  return response;
}

function getEmotion(message) {
  var detectedkeyWordList = [];

  // still need to add message string cleaning.
  message = message
    .toString()
    .toLowerCase()
    .replaceAll("!", "")
    .replaceAll("?", "")
    .replaceAll("*", "")
    .replaceAll("#", "");

  var emotion = null;

  for (let i = 0; i < Object.keys(Data.keyWordList).length; i++) {
    if (message.split(" ").includes(Data.keyWordList[i])) {
      detectedkeyWordList.push(Data.keyWordList[i]);
    }
  }

  console.log("\nmessage: ", message);
  console.log(
    "\ndetectedKeyWords: ",
    detectedkeyWordList,
    detectedkeyWordList.length
  );

  if (detectedkeyWordList === []) {
    console.log("\n\nNO KEYWORD DETECTED IN THE SENTENCE:");
    console.log("\nMessage: ", message);
    emotion = "sorry";
    return emotion;
  }

  emotionMappedList = [];

  for (const [emotionKey, emotionValue] of Object.entries(
    Data.emotionMapDict
  )) {
    for (let i = 0; i < detectedkeyWordList.length; i++) {
      if (emotionValue.includes(detectedkeyWordList[i])) {
        emotionMappedList.push(emotionKey);
      }
    }
  }

  for (let i = 0; i < emotionMappedList.length; i++) {
    for (let j = 0; j < Data.keyWordPriorityList.length; j++) {
      //console.log("emotionmappeddict:", emotionMappedList[i]);
      if (Data.keyWordPriorityList[j] == emotionMappedList[i]) {
        emotion = Data.keyWordPriorityList[j];
      }
      if (emotionMappedList[i] == undefined) break;
    }
  }

  console.log(
    `\n\nMessage: ${message} \nDetectedKeyWordList: ${detectedkeyWordList} \nemotionMappedDict: ${emotionMappedList} \nemotion: ${emotion}`
  );
  return emotion;
}

module.exports = {
  TenorGifSearch,
  getResponse,
  getEmotion,
  searchSeries,
  recommendSeries,
  getTmdbResults,
  getWatchList,
  getCharacterInfo,
  initCommandContext,
};
