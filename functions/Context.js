var guildData = new Map();

function createContext() {
  return {
    connection: null,
    playlist: [],
    user: null,
    titleSearched: null,
    voiceChannel: null,
    message: null,
    nowPlaying: null,
    playerStatus: null,
    playlistPage: 0,
    player: createAudioPlayer({
      noSubscriber: NoSubscriberBehavior.Pause,
    }),
    globalPlaylistTracker: 0,
  };
}

const { createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");

function setGuildData(message) {
  //console.log(`\nguildDataObject Keys: \n${[...guildData.keys()]} \n\n`);
  console.log("\n\n\n...guildDataObject...\n\n\n");
  guildData.forEach(function (key, value) {
    console.log("\n", key, JSON.stringify(value, null, 4), "\n");
  });
  console.log("\n\n\n---------------------\n\n\n");
  //console.log(
  //  `\nguildDataObject Values: \n${Object.fromEntries([...guildData])} \n\n`
  //);
  //const iterator = guildData.keys();

  //console.log(`guildDataObject \n${iterator.next().value}`);
  let guildId = message.guildId;
  console.log("guildID:", guildId);

  guildData.set(guildId, setContext(message));
}

function setContext(message) {
  const key = message.guildId;
  var context = guildData.get(key);

  if (!context) {
    context = createContext();
  }

  context.voiceChannel = message.member.voice.channel;
  context.user = message.author;
  context.message = message;

  messageContent = message.content; // clean the message before analysing

  try {
    context.titleSearched = {
      title: messageContent
        .match(/"(.*?)"/g)
        .toString()
        .replaceAll('"', ""),
      url: null,
      loop: false,
    };

    if (context.titleSearched) {
      context.titleSearched;
    }
  } catch {
    context.titleSearched = null;
  }

  return context;
}

function updatePlayer(guildId, player) {
  guildData.set(guildId, player);
  return;
}

function getGuildData(guildId) {
  //console.log(
  //  `guildDataObject \n${JSON.stringify(Object.keys(guildData), null, 4)}`
  //);
  let key = guildId;
  console.log("getting context for guildID:", key);

  if (!guildData.has(key)) return;

  return guildData.get(key);
}

module.exports = {
  setGuildData,
  getGuildData,
  updatePlayer,
};
