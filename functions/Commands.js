// commands.js

const Data = require("../data/emotions");
const malScraper = require("mal-scraper");

var context = {
  connection: null,
  playlist: [],
  user: null,
  message: null,
  messageContent: null,
};

async function initCommandContext(message) {
  context.user = message.author;
  context.message = message;

  context.messageContent = message.content // clean the message before analysing
    .toLowerCase()
    .replaceAll("!", "")
    .replaceAll("?", "")
    .replaceAll("*", "")
    .replaceAll("#", "");

  return;
}

function searchSeries(series) {
  return malScraper
    .getResultsFromSearch(series)
    .then((data) => {
      return data[0];
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

function getTmdbResults(series) {
  const { TMDB_API_KEY } = require("../config.json");
  const mdb = require("moviedb")(TMDB_API_KEY);

  mdb.searchMovie({ query: series }, (err, res) => {
    console.log(res.results[0]);
  });
}

function getMovieDetails(Id) {
  const { TMDB_API_KEY } = require("../config.json");
  const mdb = require("moviedb")(TMDB_API_KEY);

  mdb.movieInfo({ id: Id }, (err, res) => {
    console.log(res);
  });
}

function recommendSeries(series) {
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
  getWatchList,
  initCommandContext,
};
