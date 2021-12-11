//const ytdl = require("ytdl-core");
//const ytsr = require("ytsr");
//const { SoundCloud } = require("scdl-core");
//const scdl = new SoundCloud();
const SpotifyWebApi = require("spotify-web-api-node");
const requestA = require("async-request");
const config = require("../../config.json");
const spotifyApi = new SpotifyWebApi({
  clientId: config.SPOTIFY_ID,
  clientSecret: config.SPOTIFY_SECRET,
  redirectUri: "https://eyezah.com",
});
//scdl.connect();

function returnCode(type, code = undefined) {
  // returncode formatter
  return {
    type: type,
    code: code,
  };
}

function getSpotifyToken() {
  console.log("getting spot token");
  spotifyApi.clientCredentialsGrant().then(function (data) {
    console.log("token is " + data.body["access_token"]);
    spotifyApi.setAccessToken(data.body["access_token"]);
    setTimeout(function () {
      getSpotifyToken();
    }, (data.body["expires_in"] - 60) * 1000);
  });
}
getSpotifyToken();

async function getDataYoutube(id, guildId) {
  try {
    var info = await ytdl.getInfo(id);
  } catch {
    return returnCode(0, "no track");
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

async function getPartyData(id, guildId) {
  ///////// check party
  return returnCode(1, [
    generateMetaFormat(
      "party",
      null,
      id,
      id,
      "Party",
      "https://eyezah.com", // party url
      "https://eyezah.com", // party owner url
      "https://avatars.githubusercontent.com/u/50851883?v=4", // party thumbnail
      null
    ),
  ]);
}

async function getDataYoutubePlaylist(id, guildId) {
  try {
    var response = await requestA(
      "https://www.googleapis.com/youtube/v3/playlistItems?key=" +
        process.env.YOUTUBE_KEY +
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
          process.env.YOUTUBE_KEY +
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

async function getDataSpotifyAlbum(id, guildId) {
  try {
    var next = 0;
    var tracks = [];
    var info = await spotifyApi.getAlbum(id);
    var original = info.body;
    info = info.body.tracks;
    var total = info.total;
    info = info.items;
    var i = 0;
    while (i < info.length) {
      var artistList = "";
      var a = 0;
      while (a < info[i].artists.length) {
        if (artistList != "") {
          if (i + 1 == info[i].artists.length) {
            artistList += " & ";
          } else {
            artistList += ", ";
          }
        }
        artistList += info[i].artists[a].name;
        a++;
      }

      tracks.push(
        generateMetaFormat(
          "spotify",
          info[i].id,
          "guild-" + guildId,
          info[i].name,
          artistList,
          info[i].external_urls.spotify,
          info[i].artists[0].external_urls.spotify,
          original.images[0].url,
          null
        )
      );
      next++;
      i++;
    }

    while (next < total) {
      info = await spotifyApi.getAlbum(id, { limit: 100, offset: next });
      info = info.body.tracks;
      total = info.total;
      info = info.items;
      var i = 0;
      while (i < info.length) {
        var artistList = "";
        var a = 0;
        while (a < info[i].artists.length) {
          if (artistList != "") {
            if (i + 1 == info[i].artists.length) {
              artistList += " & ";
            } else {
              artistList += ", ";
            }
          }
          artistList += info[i].artists[a].name;
          a++;
        }

        tracks.push(
          generateMetaFormat(
            "spotify",
            info[i].id,
            "guild-" + guildId,
            info[i].name,
            artistList,
            info[i].external_urls.spotify,
            info[i].artists[0].external_urls.spotify,
            original.images[0].url,
            null
          )
        );
        next++;
        i++;
      }
    }
    return returnCode(1, tracks);
  } catch (e) {
    console.log(e);
    return returnCode(0, "no track");
  }
  return returnCode(1, "untested spotify playlist success");
}

async function getDataSpotifyPlaylist(id, guildId) {
  try {
    var next = 0;
    var tracks = [];
    var info = await spotifyApi.getPlaylist(id, { limit: 100, offset: next });
    info = info.body.tracks;
    var total = info.total;
    info = info.items;
    var i = 0;
    while (i < info.length) {
      var artistList = "";
      var a = 0;
      while (a < info[i].track.artists.length) {
        if (artistList != "") {
          if (i + 1 == info[i].track.artists.length) {
            artistList += " & ";
          } else {
            artistList += ", ";
          }
        }
        artistList += info[i].track.artists[a].name;
        a++;
      }

      tracks.push(
        generateMetaFormat(
          "spotify",
          info[i].track.id,
          "guild-" + guildId,
          info[i].track.name,
          artistList,
          info[i].track.external_urls.spotify,
          info[i].track.artists[0].external_urls.spotify,
          info[i].track.album.images[0].url,
          null
        )
      );
      next++;
      i++;
    }

    while (next < total) {
      info = await spotifyApi.getPlaylist(id, { limit: 100, offset: next });
      info = info.body.tracks;
      total = info.total;
      info = info.items;
      var i = 0;
      while (i < info.length) {
        var artistList = "";
        var a = 0;
        while (a < info[i].track.artists.length) {
          if (artistList != "") {
            if (i + 1 == info[i].track.artists.length) {
              artistList += " & ";
            } else {
              artistList += ", ";
            }
          }
          artistList += info[i].track.artists[a].name;
          a++;
        }

        tracks.push(
          generateMetaFormat(
            "spotify",
            info[i].track.id,
            "guild-" + guildId,
            info[i].track.name,
            artistList,
            info[i].track.external_urls.spotify,
            info[i].track.artists[0].href,
            info[i].track.album.images[0].url,
            null
          )
        );
        next++;
        i++;
      }
    }
    return returnCode(1, tracks);
  } catch (e) {
    console.log(e);
    return returnCode(0, "no track");
  }
  return returnCode(1, "untested spotify playlist success");
}

async function getDataSpotify(id, guildId) {
  try {
    var info = await spotifyApi.getTrack(id);
    info = info.body;
  } catch (e) {
    console.log(e);
    return returnCode(0, "no track");
  }
  var artistList = "";
  var i = 0;
  while (i < info.artists.length) {
    if (artistList != "") {
      if (i + 1 == info.artists.length) {
        artistList += " & ";
      } else {
        artistList += ", ";
      }
    }
    artistList += info.artists[i].name;
    i++;
  }

  var filters = await ytsr.getFilters(artistList + " - " + info.name);
  var filter = filters.get("Type").get("Video");
  var result = await ytsr(filter.url, { limit: 1 });
  if (result.items.length == 0) return returnCode(0, "no track");

  var rawdur = result.items[0].duration.split(":");
  if (rawdur.length == 1) {
    var duration = parseInt(rawdur[0]);
  } else if (rawdur.length == 2) {
    var duration = parseInt(rawdur[1]) + parseInt(rawdur[0] * 60);
  } else if (rawdur.length == 3) {
    var duration =
      parseInt(rawdur[2]) +
      parseInt(rawdur[1] * 60) +
      parseInt(rawdur[0] * 3600);
  }

  return returnCode(1, [
    generateMetaFormat(
      "youtube",
      result.items[0].id,
      "guild-" + guildId,
      info.name,
      artistList,
      info.external_urls.spotify,
      info.artists[0].href,
      info.album.images[0].url,
      duration
    ),
  ]);

  return returnCode(1, "untested spotify success");
}

async function getDataSoundcloud(id, guildId) {
  console.log("soundcloud:", id);
  try {
    var track = await scdl.tracks.getTrack(id);

    if (track.kind == "track") {
      if (
        track.publisher_metadata == undefined ||
        track.publisher_metadata.artist == undefined
      ) {
        var artist = track.user.username;
      } else {
        var artist = track.publisher_metadata.artist;
      }
      if (
        track.publisher_metadata == undefined ||
        track.publisher_metadata.release_title == undefined
      ) {
        var title = track.title;
      } else {
        var title = track.publisher_metadata.release_title;
      }

      return returnCode(1, [
        generateMetaFormat(
          "soundcloud",
          track.permalink_url,
          "guild-" + guildId,
          title,
          artist,
          track.permalink_url,
          track.user.permalink_url,
          track.artwork_url,
          Math.floor(track.duration / 1000)
        ),
      ]);
    } else if (track.kind == "playlist" || track.kind == "system-playlist") {
      var i = 0;
      var ids = [];
      var out = [];
      while (i < track.tracks.length) {
        if (track.tracks[i].created_at) {
          if (
            track.tracks[i].publisher_metadata == undefined ||
            track.tracks[i].publisher_metadata.artist == undefined
          ) {
            var artist = track.tracks[i].user.username;
          } else {
            var artist = track.tracks[i].publisher_metadata.artist;
          }
          if (
            track.tracks[i].publisher_metadata == undefined ||
            track.tracks[i].publisher_metadata.release_title == undefined
          ) {
            var title = track.tracks[i].title;
          } else {
            var title = track.tracks[i].publisher_metadata.release_title;
          }
          out.push(
            generateMetaFormat(
              "soundcloud",
              track.tracks[i].permalink_url,
              "guild-" + guildId,
              title,
              artist,
              track.tracks[i].permalink_url,
              track.tracks[i].user.permalink_url,
              track.tracks[i].artwork_url,
              Math.floor(track.tracks[i].duration / 1000)
            )
          );
        } else {
          ids.push(track.tracks[i].id);
        }
        i++;
      }
      i = 0;
      var tracks = [];
      while (i < Math.ceil(ids.length / 50)) {
        var a = i * 50;
        var idList = [];
        while (a < (i + 1) * 50 && a < ids.length) {
          idList.push(ids[a]);
          a++;
        }
        var tracks = tracks.concat(await scdl.tracks.getTracksByIds(idList));
        i++;
      }
      while (i < tracks.length) {
        if (
          tracks[i].publisher_metadata == undefined ||
          tracks[i].publisher_metadata.artist == undefined
        ) {
          var artist = tracks[i].user.username;
        } else {
          var artist = tracks[i].publisher_metadata.artist;
        }
        if (
          tracks[i].publisher_metadata == undefined ||
          tracks[i].publisher_metadata.release_title == undefined
        ) {
          var title = tracks[i].title;
        } else {
          var title = tracks[i].publisher_metadata.release_title;
        }

        out.push(
          generateMetaFormat(
            "soundcloud",
            tracks[i].permalink_url,
            "guild-" + guildId,
            title,
            artist,
            tracks[i].permalink_url,
            tracks[i].user.permalink_url,
            tracks[i].artwork_url,
            Math.floor(tracks[i].duration / 1000)
          )
        );
        i++;
      }
      return returnCode(1, out);
    }
    return returnCode(1, [
      generateMetaFormat("soundcloud", id, "guild-" + guildId),
    ]);
  } catch (e) {
    console.log(e);
    return returnCode(0, "no track");
  }
}

async function getDataUrl(id, guildId) {
  console.log("its a data url?");
  //return returnCode(0, "unsupported type");
  return returnCode(1, [
    generateMetaFormat(
      "direct url",
      id,
      "guild-" + guildId,
      "direct url",
      "direct url",
      id,
      id,
      undefined,
      undefined
    ),
  ]);
  //return returnCode(1, "untested direct url success");
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

module.exports = {
  getDataYoutube,
  getDataYoutubePlaylist,
  getDataSpotifyPlaylist,
  getDataSpotify,
  getDataSoundcloud,
  getDataUrl,
  //scdl,
  spotifyApi,
  getPartyData,
  getDataSpotifyAlbum,
};
