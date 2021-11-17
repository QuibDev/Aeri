const ytdl = require("ytdl-core");
const play = require("play-dl");
const ytSearch = require("yt-search");
const colors = require("../data/colors.json");
const { AudioPlayerStatus } = require("@discordjs/voice");

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  StreamType,
} = require("@discordjs/voice");
const e = require("express");

var context = {
  connection: null,
  playlist: [],
  user: null,
  titleSearched: null,
  voiceChannel: null,
  message: null,
  nowPlaying: null,
};

const player = createAudioPlayer({
  noSubscriber: NoSubscriberBehavior.Pause,
});

player.on(AudioPlayerStatus.Idle, () => {
  context.nowPlaying = null;

  if (context.playlist.length) {
    console.log(`\nSong ${context.playlist[0]} ended.\n`);
    context.playlist.shift();
    console.log(`\nNew context.playlist: ${context.playlist}.\n`);
    context.titleSearched = context.playlist[0];
    playResource();
    console.log(`\nNow playing ${context.playlist[0]}\n`);
  }
});

player.on(AudioPlayerStatus.Playing, () => {
  context.nowPlaying = context.playlist[0];

  videoFinder(context.playlist[0]).then((song) => {
    context.message.reply({
      channel_id: `${context.user.channelID}`,
      content: `Now playing!`,
      tts: false,
      components: [
        {
          type: 1,
          components: [
            {
              style: 5,
              label: `Watch On Youtube`,
              url: `${song.url}`,
              disabled: false,
              type: 2,
            },
          ],
        },
      ],
      embeds: [
        {
          type: "rich",
          title: `${song.title}`,
          description: `\nBy **${song.author.name}** \n\n:signal_strength: **${song.views} views**           :play_pause: **${song.timestamp} minutes**`,
          color: colors.embededColor,
          thumbnail: {
            url: `${song.image}`,
            height: 350,
            width: 350,
          },
        },
      ],
    });
  });
});

async function initContext(message) {
  context.voiceChannel = message.member.voice.channel;
  context.user = message.author;
  context.message = message;

  messageContent = message.content // clean the message before analysing
    .toLowerCase()
    .replaceAll("!", "")
    .replaceAll("?", "")
    .replaceAll("*", "")
    .replaceAll("#", "");

  try {
    context.titleSearched = messageContent
      .match(/"(.*?)"/g)
      .toString()
      .replaceAll('"', "");

    if (context.titleSearched) {
      context.titleSearched += " music video";
    }
  } catch {
    context.titleSearched = null;
  }
  return;
}

const videoFinder = async (query) => {
  const videoResult = await ytSearch(query);

  return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
};

function skipCommand() {
  if (context.playlist.length >= 1) {
    console.log(`\nSong ${context.playlist.shift()} is skipped.\n`);
    if (context.playlist[0]) {
      context.titleSearched = context.playlist[0];
      console.log(`\nNow playing ${context.titleSearched}\n`);
      context.message.reply(
        `:track_next: Track skipped! Now playing **${context.titleSearched}**`
      );
      playResource();
    }
  } else {
    context.message.reply(
      `the playlist is empty! ${context.user} If you want to add more songs just type **aeri help!**`
    );
  }

  return;
}

async function queueCommand() {
  if (context.titleSearched) {
    console.log("\ntitle searched in que command: \n", context.titleSearched);
    context.message.channel.sendTyping();
    await new Promise((r) => setTimeout(r, 100));

    // wouldn't work if you have a playlist and you want to playsomethign else right now
    await videoFinder(context.titleSearched)
      .then((song) => {
        context.playlist.push(song.title);

        //console.log("\n\n\n", context.nowPlaying, "\n\n\n");

        console.log("song added to playlist: ", song.title);
        console.log("playlist: ", context.playlist);
        context.message.reply({
          channel_id: `${context.user.channelID}`,
          content: `Added to queue!`,
          tts: false,
          components: [
            {
              type: 1,
              components: [
                {
                  style: 5,
                  label: `Watch On Youtube`,
                  url: `${song.url}`,
                  disabled: false,
                  type: 2,
                },
              ],
            },
          ],
          embeds: [
            {
              type: "rich",
              title: `${song.title}`,
              description: `\nBy **${song.author.name}** \n\n:signal_strength: **${song.views} views**           :play_pause: **${song.timestamp} minutes**`,
              color: colors.embededColor,
              thumbnail: {
                url: `${song.image}`,
                height: 350,
                width: 350,
              },
            },
          ],
        });
      })
      .catch(() => {
        context.message.channel.sendTyping();
        context.message.channel.send(
          ":persevere: Aeri couldn't find any results for this :<<<<"
        );

        playlistCommand();
        context.titleSearched = context.playlist[0];
      });
    return;
  } else {
    context.message.channel.sendTyping();
    await new Promise((r) => setTimeout(r, 1000));
    context.message.reply(":]");
    await new Promise((r) => setTimeout(r, 1000));
    context.message.reply("I'm sorry I can't find this song on youtube!");
    await new Promise((r) => setTimeout(r, 1000));
    context.message.channel.send(
      `Actually, ${context.user} you need to include the song's title under " " for me to look it up!`
    );
    return;
  }
}

async function playResource() {
  console.log(`\nsearch term: ${context.titleSearched}`);

  const video = await videoFinder(context.titleSearched).catch(() => {
    context.message.channel.sendTyping();
    context.message.reply(":]");
    context.message.reply(
      "I'm sorry but Aeri can't find this song on youtube!"
    );
    context.message.channel.send(
      `Hey ${context.user}, maybe you should try changing the keywords a bit! `
    );
    return;
  });

  if (video) {
    console.log("found video on youtube: ", video.title, video.url);

    let stream = await play.stream(video.url);
    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    try {
      connection.subscribe(player);
    } catch {
      context.message.reply(
        "I'm sorry! but Aeri can't connect to the VC :<<< Maybe you should try again!"
      );
      return;
    }

    try {
      player.play(resource);
    } catch {
      console.log("\ncontext.message object invalid\n");
    }
  }
  return;
}

async function playCommand() {
  if (context.titleSearched) {
    console.log("bool value of titleSearch ", context.titleSearched);

    await queueCommand()
      .then(() => {
        console.log(`\nnew playlist: ${playlist} ${context.playlist.length}\n`);
      })
      .catch(() => {
        console.log("Invalid song title");
        return;
      });
  } else {
    if (context.playlist.length) {
      context.titleSearched = context.playlist[0];
    } else {
      context.message.channel.send({
        channel_id: `${context.user.channelID}`,
        content: `Sorry, ${context.user} but the playlist is empty! You can use the following commands to add some tunes right away ;D!`,
        tts: false,
        embeds: [
          {
            type: "rich",
            title: `Aeri Music Commands`,
            description: `**:arrow_forward: Aeri play "songTitle"**  - To search and play a music! \n\n**:asterisk: Aeri que "songTitle"** - To add a song to the que! \n\n**:pause_button: Aeri pause** - To pause the current song! \n\n**:play_pause: Aeri resume** - To resume the current song! \n\n**:hash: Aeri playlist** - To show the current playlist! \n\n**:stop_button: Aeri leave** - To make aeri leave the Voice Channel.`,
            color: colors.embededColor,
          },
        ],
      });
    }
  }

  joinVC();
  playResource();

  return;
}

async function playlistCommand() {
  console.log(
    `context.playlist ${context.playlist} length ${context.playlist.length}`
  );

  if (context.playlist.length) {
    await videoFinder(context.playlist[0]).then((nowPlaying) => {
      let playlistDescription = `\n **:arrow_forward:** ${nowPlaying.title}\n\n **Playlist**`;

      for (let i = 0; i < context.playlist.length; i++) {
        playlistDescription += `\n **${i + 1}.** ${context.playlist[i]}`;
      }

      context.message.channel.send({
        channel_id: `${context.user.channelID}`,
        content: `Here is the current playlist!`,
        tts: false,
        embeds: [
          {
            type: "rich",
            title: `Currently Playing`,
            description: playlistDescription,
            color: colors.embededColor,
            thumbnail: {
              url: `${nowPlaying.image}`,
              height: 200,
              width: 200,
            },
          },
        ],
      });
    });
  } else {
    context.message.channel.send({
      channel_id: `${context.user.channelID}`,
      content: `Sorry! ${context.user} but Aeri sees that the playlist is empty! You can use the following commands to add some tunes right away ;D!`,
      tts: false,
      embeds: [
        {
          type: "rich",
          title: `Aeri Music Commands`,
          description: `**:arrow_forward: Aeri Play "songTitle"**  - To search and play a music! \n\n**:asterisk: Aeri que "songTitle"** - To add a song to the que! \n\n**:pause_button: Aeri pause** - To pause the current song! \n\n**:play_pause: Aeri resume** - To resume the current song! \n\n**:hash: Aeri playlist** - To show the current playlist! \n\n**:stop_button: Aeri leave** - To make aeri leave the Voice Channel.`,
          color: colors.embededColor,
        },
      ],
    });
  }
}

function joinVC() {
  if (context.playlist.length) {
    messageContent = context.message.content // clean the message before analysing
      .toLowerCase()
      .replaceAll("!", "")
      .replaceAll("?", "")
      .replaceAll("*", "")
      .replaceAll("#", "");

    if (!context.voiceChannel)
      return context.message.reply(
        `Ummm, ${context.user} You need to be in a voice channel to execute this command!`
      );
    const permissions = context.voiceChannel.permissionsFor(
      context.message.client.user
    );
    if (!permissions.has("CONNECT"))
      return context.message.channel.send(
        "Aeri sees that You dont have the correct permissions :<"
      );
    if (!permissions.has("SPEAK"))
      return context.message.channel.send(
        "Aeri sees that You dont have the correct permissions :<"
      );

    // joining a vc from a message

    const channelID = context.message.member.voice.channel.id;

    console.log(`context.voiceChannel ID: ${channelID}`);

    connection = joinVoiceChannel({
      channelId: channelID,
      guildId: context.message.guild.id,
      adapterCreator: context.message.guild.voiceAdapterCreator,
    });
  }

  return;
}

function pauseCommand() {
  player.pause();
  context.message.reply(`:pause_button: now paused`);
}

function resumeCommand() {
  player.unpause();
}

function leaveCommand() {
  const channelID = context.message.member.voice.channel
    .toString()
    .replaceAll("<", "")
    .replaceAll(">", "")
    .replaceAll("#", "");

  console.log(`VoiceChannel ID: ${channelID}`);

  const connection = joinVoiceChannel({
    channelId: channelID,
    guildId: context.message.guild.id,
    adapterCreator: context.message.guild.voiceAdapterCreator,
  });

  player.stop();
  connection.disconnect(player);
  context.playlist = []; // empty the playlist
  context.message.reply(`:record_button: left voice channel sucessfully`);
}

function helpCommand() {
  context.message.reply({
    channel_id: `${context.message.channelId}`,
    content: `${context.message.author}`,
    tts: false,
    embeds: [
      {
        type: "rich",
        title: ` ~ MyAnimeList Commands ~  `,
        description: `:wave: Hey there! @Sods You can use the following commands to add some tunes right away ;D!`,
        color: 0x00ffff,
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

module.exports = {
  initContext,
  helpCommand,
  playCommand,
  queueCommand,
  playlistCommand,
  skipCommand,
  pauseCommand,
  resumeCommand,
  leaveCommand,
};
