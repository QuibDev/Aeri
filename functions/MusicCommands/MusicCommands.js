const ytdl = require("ytdl-core");
const play = require("play-dl");
const ytSearch = require("yt-search");
const colors = require("../../data/colors.json");
const { AudioPlayerStatus } = require("@discordjs/voice");
const metaGetter = require("./metaGetter");
const { getGuildData } = require("./../Context");
var globalPlaylistTracker = 0;

var context = null;
var player = null;

function initMusicCommandContext(guildId) {
  const key = guildId;
  context = getGuildData(key);

  player = context.player;

  console.log(
    `\nPlayer Object for guildid ${guildId} is \n ${JSON.stringify(
      player,
      null,
      4
    )}`
  );
}

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  StreamType,
} = require("@discordjs/voice");

try {
  context.player.on(AudioPlayerStatus.Idle, () => {
    context.nowPlaying = null;

    if (context.playlist.length) {
      console.log(`\nSong ${context.playlist[globalPlaylistTracker]} ended.\n`);

      // this part should only happen if the song object has the .loop value set to false
      if (context.playlist[globalPlaylistTracker].loop) {
        console.log(
          `\nLooping song: ${context.playlist[globalPlaylistTracker]}.\n`
        );
        console.log(`\nNew context.playlist: ${context.playlist}.\n`);
      } else {
        globalPlaylistTracker += 1;
        console.log(`\nNew context.playlist: ${context.playlist}.\n`);
        context.titleSearched = context.playlist[globalPlaylistTracker];
        console.log(
          `\n\nNew TitleSearched on 49 : ${context.titleSearched}.\n`
        );
      }
      playResource();
      console.log(`\nNow playing ${context.playlist[globalPlaylistTracker]}\n`);
    }
  });

  context.player.on(AudioPlayerStatus.Playing, () => {
    context.nowPlaying = context.playlist[globalPlaylistTracker];

    if (context.playlist[globalPlaylistTracker]) {
      videoFinder(context.playlist[globalPlaylistTracker].title).then(
        (song) => {
          try {
            context.message.reply({
              channel_id: `${context.user.channelID}`,
              content: `Now playing!`,
              tts: false,
              components: [
                {
                  type: 1,
                  components: [
                    {
                      style: 1,
                      label: `Previous`,
                      custom_id: `previousTrackButton`,
                      disabled: false,
                      type: 2,
                    },
                    {
                      style: 1,
                      label: `Pause / Unpause`,
                      custom_id: `pauseTrackButton`,
                      disabled: false,
                      type: 2,
                    },
                    {
                      style: 1,
                      label: `Next`,
                      custom_id: `nextTrackButton`,
                      disabled: false,
                      type: 2,
                    },
                    {
                      style: 1,
                      label: `Loop`,
                      custom_id: `loopTrackButton`,
                      disabled: false,
                      type: 2,
                    },
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
                  description: `\nBy **${song.author.name}** \n\n:signal_strength: **${song.views} views**           :play_pause: **${song.timestamp} minutes**           :arrows_counterclockwise: ${context.titleSearched.loop}`,
                  color: colors.embededColor,
                  thumbnail: {
                    url: `${song.image}`,
                    height: 350,
                    width: 350,
                  },
                },
              ],
            });
          } catch {
            (e) => {
              console.log(e);
            };
          }
        }
      );
    }
  });
} catch {
  {
    console.log("\n\nError Ocurred when detecting player\n\n");
  }
}

const videoFinder = async (query) => {
  console.log(`\n\nVideoFinder Query: ${query}`);

  try {
    const videoResult = await ytSearch(query);
    return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
  } catch {
    (e) => {
      console.log("\nInvalid videoQuery: ");
      console.log("\nLog: ", e);
    };
  }
};

function loopCommand() {
  context.playlist[globalPlaylistTracker].loop = true;
  console.log(
    "\n\n SONG IS LOOPING: ",
    context.playlist[globalPlaylistTracker]
  );

  playCommand();
}

function prevCommand() {
  if (context.playlist.length >= 1) {
    console.log(
      `\nSong ${context.playlist[globalPlaylistTracker]} is skipped.\n`
    );
    globalPlaylistTracker -= 1;
    if (context.playlist[globalPlaylistTracker]) {
      context.titleSearched = context.playlist[globalPlaylistTracker];
      console.log(`\nNow playing ${context.titleSearched}\n`);
      context.message.reply(
        `:rewind: Going Back! Now playing **${context.titleSearched.title}**`
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

function skipCommand() {
  if (context.playlist.length >= 1) {
    console.log(
      `\nSong ${context.playlist[globalPlaylistTracker]} is skipped.\n`
    );
    globalPlaylistTracker += 1;
    if (context.playlist[globalPlaylistTracker]) {
      context.titleSearched = context.playlist[globalPlaylistTracker];
      console.log(`\nNow playing ${context.titleSearched.title}\n`);
      context.message.reply(
        `:track_next: Track skipped! Now playing **${context.titleSearched.title}**`
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

function clearPlaylistCommand() {
  context.playlist = [];
  context.playlistPage = 0;
  context.message.channel.send(
    `Okay, ${context.user} I've cleared the playlist! You can begin anew now ;>`
  );
  return;
}

async function queueCommand() {
  if (context.titleSearched) {
    if (context.titleSearched.title.includes("https")) {
      console.log("\nTitleSearch is a url\n");

      if (context.titleSearched.title.includes("open.spotify")) {
        context.message.channel.sendTyping();
        await new Promise((r) => setTimeout(r, 1000));
        context.message.reply(
          `Uh-huh... I see that this is a spotify playlist. Wait i'll need to look up the deets :D`
        );
      }

      var Data = await metaGetter.getTrack(
        context.titleSearched.title,
        "guildID-default"
      );

      if (Data) {
        context.message.channel.sendTyping();
        await new Promise((r) => setTimeout(r, 1500));

        context.message.channel.send(
          `Okay I've looked through all the songs - you have *interesting* tastes.`
        );
        if (Data.code.length < 50) {
          await new Promise((r) => setTimeout(r, 1000));
          context.message.channel.send(
            `Anyways... The playlist has ${Data.code.length} songs.`
          );
        } else {
          await new Promise((r) => setTimeout(r, 1000));
          context.message.channel.send(
            `Anyways... The playlist has ${Data.code.length} songs - ***JEJUS CHRIST***.`
          );
        }
        let time = Math.ceil(1.1 * Data.code.length);
        await new Promise((r) => setTimeout(r, 1000));
        context.message.channel.send(
          `It'll take me about **${time} seconds** to que them up. - i'll ping you with the playlist when i'm done!`
        );
        //context.message.channel.send(
        //  `In the meantime, how about you google ${googleObject}`
        //);
      }

      for (let i = 0; i < Data.code.length; i++) {
        if (
          !Data.code[i].url.split("://")[1].includes("youtu.be") ||
          !Data.code[i].url.split("://")[1].includes("youtube.com")
        ) {
          console.log("\n\n Converting non-youtube track to youtube");
          await videoFinder(
            `${Data.code[i].artist} - ${Data.code[i].title}`
          ).then((song) => {
            let queObject = { title: song.title, url: song.url, loop: false };

            context.playlist.push(queObject);

            if (Data.code.length === 1) {
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
                    description: `\nBy **${song.author.name}** \n\n:signal_strength: **${song.views} views**           :play_pause: **${song.timestamp} minutes**           :arrows_counterclockwise: ${context.titleSearched.loop}`,
                    color: colors.embededColor,
                    thumbnail: {
                      url: `${song.image}`,
                      height: 350,
                      width: 350,
                    },
                  },
                ],
              });
              return;
            }
          });
        }
      }

      if (Data.code.length >= 1) playlistCommand();
      return;
    }
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
  console.log("\ntitle searched in que command: \n", context.titleSearched);
  context.message.channel.sendTyping();
  await new Promise((r) => setTimeout(r, 100));

  await videoFinder(context.titleSearched.title)
    .then((song) => {
      context.titleSearched.title = song.title;
      context.titleSearched.url = song.url;
      context.playlist.push(context.titleSearched);

      console.log("\nsong added to playlist: ", context.titleSearched.title);
      console.log("playlist: ", context.playlist);
      console.log("looping: ", context.titleSearched.loop);
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
            description: `\nBy **${song.author.name}** \n\n:signal_strength: **${song.views} views**           :play_pause: **${song.timestamp} minutes**           :arrows_counterclockwise: **${context.titleSearched.loop}**`,
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
      context.titleSearched = context.playlist[globalPlaylistTracker];
      console.log(`\n\nNew TitleSearched on 244 : ${context.titleSearched}.\n`);
    });
  return;
}

async function playResource() {
  try {
    console.log(
      "found video on youtube: ",
      context.playlist[globalPlaylistTracker].title,
      context.playlist[globalPlaylistTracker].url
    );
  } catch {
    context.message.channel.sendTyping();
    context.message.reply(":]");
    context.message.reply(
      "I'm sorry but Aeri can't find this song on youtube!"
    );
    context.message.channel.send(
      `Hey ${context.user}, maybe you should try changing the keywords a bit! `
    );
    return;
  }

  let stream = await play.stream(context.playlist[globalPlaylistTracker].url);
  let resource = createAudioResource(stream.stream, {
    inputType: stream.type,
  });

  try {
    connection.subscribe(context.player);
  } catch {
    context.message.reply(
      "I'm sorry! but Aeri can't connect to the VC :<<< Maybe you should try again!"
    );
    return;
  }

  try {
    context.player.play(resource);
  } catch {
    console.log("\ncontext.message object invalid\n");
  }
  return;
}

async function playCommand() {
  if (context.titleSearched) {
    console.log("bool value of titleSearch ", context.titleSearched.title);

    await queueCommand()
      .then(() => {
        console.log(
          `\nnew playlist: ${context.playlist} ${context.playlist.length}\n`
        );
      })
      .catch(() => {
        console.log("Invalid song title");
        return;
      });
  } else {
    if (context.playlist.length) {
      context.titleSearched = context.playlist[0];
      console.log(`\n\nNew TitleSearched on 320 : ${context.titleSearched}.\n`);
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

async function playlistCommand(nextPage = false, previousPage = false) {
  if (!context.playlist.length) {
    {
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
    return;
  }

  console.log(
    `\ncontext.playlist ${context.playlist} length ${context.playlist.length} \nGlobalPlaylistTracker ${globalPlaylistTracker}`
  );

  await videoFinder(context.playlist[globalPlaylistTracker].title).then(
    (nowPlaying) => {
      let playlistDescription = `\n **:arrow_forward:** ${nowPlaying.title}\n\n **Playlist**`;
      let playlistQueLimit = context.playlist.length;

      if (playlistQueLimit >= 15) {
        playlistQueLimit = 15;
        if (nextPage) {
          console.log("\nPlaylist Next Page \n");
          if (context.playlistPage <= context.playlist.length - 16)
            context.playlistPage += 15;
        }
        if (previousPage) {
          console.log("\nPlaylist Previous Page \n");
          if (context.playlistPage - 16 > 0) context.playlistPage -= 15;
        }
      }

      for (
        let i = context.playlistPage;
        i < playlistQueLimit + context.playlistPage;
        i++
      ) {
        playlistDescription += `\n **${i + 1}.** ${context.playlist[i].title}`;
      }

      context.message.channel.send({
        channel_id: `${context.user.channelID}`,
        content: `Here is the current playlist!`,
        tts: false,
        components: [
          {
            type: 1,
            components: [
              {
                style: 1,
                label: `PreviousPage`,
                custom_id: `previousPlaylistPageButton`,
                disabled: false,
                type: 2,
              },
              {
                style: 1,
                label: `Pause / Unpause`,
                custom_id: `pauseTrackButton`,
                disabled: false,
                type: 2,
              },
              {
                style: 1,
                label: `NextPage`,
                custom_id: `nextPlaylistPageButton`,
                disabled: false,
                type: 2,
              },
            ],
          },
        ],
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
      context.message.channel.send(
        `And uhh, ${context.user} you can type "aeri play" to start playing the tunes! ~ Just make sure you are in a vc though ;>`
      );
    }
  );
}

function joinVC() {
  if (!context.playlist.length) return;

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

  return;
}

function pauseCommand() {
  context.player.pause();
  context.message.reply(`:pause_button: now paused`);
  context.playerStatus = "paused";
}

function resumeCommand() {
  context.player.unpause();
  context.playerStatus = "unpause";
}

function pauseUnpauseCommand() {
  if (context.playerStatus === "paused") {
    console.log(`\ntrack ${context.playlist[globalPlaylistTracker]} resumed\n`);
    resumeCommand();
  } else {
    console.log(`\ntrack ${context.playlist[globalPlaylistTracker]} paused\n`);
    pauseCommand();
  }
}

function leaveCommand() {
  try {
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

    context.player.stop();
    connection.disconnect(context.player);
    context.playlist = []; // empty the playlist
    globalPlaylistTracker = 0;
    context.playlistPage = 0;
    context.message.reply(`:record_button: left voice channel sucessfully`);
  } catch {
    console.log("User not in VC");
    context.message.reply(
      `umm... ${context.user} you need to be in the vc to use that command!`
    );
    return;
  }
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
  helpCommand,
  playCommand,
  queueCommand,
  playlistCommand,
  loopCommand,
  prevCommand,
  skipCommand,
  clearPlaylistCommand,
  pauseCommand,
  pauseUnpauseCommand,
  resumeCommand,
  leaveCommand,
  initMusicCommandContext,
};
