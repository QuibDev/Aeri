const requestA = require("async-request");
const config = require("./../../config.json");
const ytdl = require("ytdl-core");

function returnCode(type, code = undefined) {
  // returncode formatter
  return {
    type: type,
    code: code,
  };
}

function generateMetaFormat(
  platform,
  listenId,
  playerId,
  title,
  artist,
  url,
  artistUrl,
  thumbnail,
  duration
) {
  return {
    platform: platform,
    originalPlatform: platform,
    listenId: listenId,
    playerId: playerId,
    title: title,
    artist: artist,
    url: url,
    artistUrl: artistUrl,
    thumbnail: thumbnail,
    duration: duration,
    uuid: Date.now(),
  };
}

async function getDataYoutubePlaylist(id, guildId) {
  try {
    var response = await requestA(
      "https://www.googleapis.com/youtube/v3/playlistItems?key=" +
        config.YOUTUBE_KEY +
        "&playlistId=" +
        id +
        "&part=snippet&maxResults=50"
    );

    var songs = JSON.parse(response.body);
    var nextPageToken = songs.nextPageToken;
    songs = songs.items;
    var out = [];

    var i = 0;
    while (i < songs.length) {
      //console.log("here");
      //if (i < 10) console.log(songs[i].snippet);
      if (songs[i].snippet.title != "Private video") {
        out.push(
          generateMetaFormat(
            "youtube",
            songs[i].snippet.resourceId.videoId,
            "guild-" + guildId,
            songs[i].snippet.title,
            songs[i].snippet.videoOwnerChannelTitle,
            "https://www.youtube.com/watch?v=" +
              songs[i].snippet.resourceId.videoId,
            "https://www.youtube.com/channel/" +
              songs[i].snippet.videoOwnerChannelId,
            "https://i.ytimg.com/vi/" +
              songs[i].snippet.resourceId.videoId +
              "/default.jpg",
            "duration"
          )
        );
      }
      i++;
    }
    while (nextPageToken) {
      response = await requestA(
        "https://www.googleapis.com/youtube/v3/playlistItems?key=" +
          config.YOUTUBE_KEY +
          "&playlistId=" +
          id +
          "&part=snippet&maxResults=50&pageToken=" +
          nextPageToken
      );
      songs = JSON.parse(response.body);
      nextPageToken = songs.nextPageToken;
      songs = songs.items;
      i = 0;
      while (i < songs.length) {
        //console.log("here");
        //if (i < 10) console.log(songs[i].snippet);
        if (songs[i].snippet.title != "Private video") {
          out.push(
            generateMetaFormat(
              "youtube",
              songs[i].snippet.resourceId.videoId,
              "guild-" + guildId,
              songs[i].snippet.title,
              songs[i].snippet.videoOwnerChannelTitle,
              "https://www.youtube.com/watch?v=" +
                songs[i].snippet.resourceId.videoId,
              "https://www.youtube.com/channel/" +
                songs[i].snippet.videoOwnerChannelId,
              "https://i.ytimg.com/vi/" +
                songs[i].snippet.resourceId.videoId +
                "/default.jpg",
              null
            )
          );
        }
        i++;
      }
    }
    return returnCode(1, out);
  } catch (e) {
    console.log(e);
    return returnCode(0, "no track");
  }
  return returnCode(1, "untested youtube playlist success");
}

async function getDataYoutube(id, guildId) {
  try {
    var info = await ytdl.getInfo(id);
  } catch {
    (e) => {
      console.log(e);
      return returnCode(0, "no track");
    };
  }
  return returnCode(1, [
    generateMetaFormat(
      "youtube",
      id,
      "guild-" + guildId,
      info.videoDetails.title,
      info.videoDetails.ownerChannelName,
      info.videoDetails.video_url,
      info.videoDetails.ownerProfileUrl,
      "https://i.ytimg.com/vi/" + id + "/default.jpg",
      parseInt(info.videoDetails.lengthSeconds)
    ),
  ]);
}

// debugging

async function printlog() {
  var ytData = await getDataYoutubePlaylist(
    "PLOzDu-MXXLliO9fBNZOQTBDddoA3FzZUo",
    897669628279541790
  );
  console.log(ytData);
}

//printlog();

module.exports = { getDataYoutubePlaylist, getDataYoutube };
