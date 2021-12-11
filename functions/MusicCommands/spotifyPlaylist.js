const requestA = require("async-request");
const config = require("../../config.json");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
  clientId: config.SPOTIFY_ID,
  clientSecret: config.SPOTIFY_KEY,
  redirectUri: config.WEBSITE,
});
const { returnCode } = require("./basic");

async function getSpotifyToken() {
  console.log("getting spot token");
  try {
    var data = await spotifyApi.clientCredentialsGrant();
    console.log("token is " + data.body["access_token"]);
    spotifyApi.setAccessToken(data.body["access_token"]);
    setTimeout(function () {
      getSpotifyToken();
    }, (data.body["expires_in"] - 60) * 1000);
  } catch (e) {
    console.log("caught spotify token error", e);
    setTimeout(function () {
      getSpotifyToken();
    }, 10000);
  }
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

// debugging

module.exports = {
  getSpotifyToken,
  getDataSpotifyAlbum,
  getDataSpotifyPlaylist,
  getDataSpotify,
};
