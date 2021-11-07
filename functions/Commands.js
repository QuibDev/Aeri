// commands.js

const Data = require("../data/emotions");
const malScraper = require("mal-scraper");

function searchSeries(series) {
  return malScraper
    .getResultsFromSearch(series)
    .then((data) => {
      return data[0];
    })
    .catch((err) => console.log(err));
}

function recommendSeries(series) {
  return malScraper
    .getRecommendationsList(series)
    .then((data) => {
      console.log(data[0]);
      return data[0];
    })
    .catch((err) => console.log(err));
}

function TenorGifSearch(emotion) {
  var emotion = "anime" + emotion;
  const { TENOR_API_KEY } = require("../config.json");

  const Tenor = require("tenorjs").client({
    Key: TENOR_API_KEY, // https://tenor.com/developer/keyregistration
    Filter: "off", // "off", "low", "medium", "high", not case sensitive
    Locale: "en_US", // Your locale here, case-sensitivity depends on input
    MediaFilter: "minimal", // either minimal or basic, not case sensitive
    DateFormat: "D/MM/YYYY - H:mm:ss A", // Change this accordingly
  });

  var randomInt = Math.floor(Math.random() * 50);

  return Tenor.Search.Query(emotion, "50").then((data) => {
    console.log(data[randomInt].url);
    return data[randomInt].url;
  });
}

function getResponse(emotion) {
  var response = null;
  var gif = null;
  var randomFloat = Math.random();

  if (!(emotion in Data.emotionResponseDict)) {
    emotion = "sorry";
  }

  const responseArray = Data.emotionResponseDict[emotion];
  response = responseArray[Math.floor(randomFloat * responseArray.length)];

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
      console.log("\nkeyword: ", Data.keyWordList[i]);
    }
  }

  console.log("\nmessage: ", message);
  console.log("\ndetectedKeyWords: ", detectedkeyWordList);

  if (detectedkeyWordList) {
    emotion = detectedkeyWordList[0];
  } else {
    console.log("\n\nNO KEYWORD DETECTED IN THE SENTENCE:");
    console.log("\nMessage: ", message);
    emotion = "sorry";
    return emotion;
  }

  for (const [emotionKey, emotionValue] of Object.entries(
    Data.emotionMapDict
  )) {
    if (emotionValue.includes(emotion)) {
      emotion = emotionKey;
    }
  }

  console.log(
    `\n\nMessage: ${message} \nDetectedEmotionKeyWordList:  \nemotion: ${emotion}`
  );
  return emotion;
}

module.exports = {
  TenorGifSearch,
  getResponse,
  getEmotion,
  searchSeries,
  recommendSeries,
};
