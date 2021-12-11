const { getDataYoutubePlaylist, getDataYoutube } = require("./youtubePlaylist");
const {
  getSpotifyToken,
  getDataSpotifyAlbum,
  getDataSpotifyPlaylist,
  getDataSpotify,
} = require("./spotifyPlaylist");
const spotify = require("./youtubePlaylist");
const { returnCode } = require("./basic");

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

async function getTrack(url, guildId) {
  // decide what platform url/query is from, then forward to respective function to get metadata
  var oldUrl = url;
  if (!url) {
    return basic.returnCode(0, "no track");
  }
  if (url.startsWith("https://")) {
    url = url.substring(8);
  } else if (url.startsWith("http://")) {
    url = url.substring(7);
  }
  ///////////////////////////////////
  //// checking url
  ///////////////////////////////////
  if (url != oldUrl) {
    if (url.startsWith("youtu.be/")) {
      var endString = /[^/]*$/.exec(url)[0];
      return await getDataYoutube(endString, guildId); // forward to getDataYoutube() for metadata
    } else if (url.startsWith("www.youtube.com/watch?v=")) {
      var endString = /[^?]*$/.exec(url)[0];
      var params = new URLSearchParams(endString);
      if (params.has("v")) {
        return await getDataYoutube(params.get("v"), guildId); // forward to getDataYoutube() for metadata
      } else {
        return basic.returnCode(0, "invalid url"); // invalid url
      }
    } else if (url.startsWith("www.youtube.com/playlist?")) {
      var endString = /[^?]*$/.exec(url)[0];
      var params = new URLSearchParams(endString);
      if (params.has("list")) {
        return await getDataYoutubePlaylist(params.get("list"), guildId); // forward to getDataYoutubePlaylist() for metadata
      } else {
        return basic.returnCode(0, "invalid url"); // invalid url
      }
    } else if (url.startsWith("open.spotify.com/album/")) {
      var endString = /[^/]*$/.exec(url)[0];
      await getSpotifyToken();
      return await getDataSpotifyAlbum(endString, guildId); // forward to getDataSpotifyPlaylist() for metadata
    } else if (url.startsWith("open.spotify.com/playlist/")) {
      await getSpotifyToken();
      var endString = /[^/]*$/.exec(url)[0];
      return await getDataSpotifyPlaylist(endString, guildId); // forward to getDataSpotifyPlaylist() for metadata
    } else if (url.startsWith("open.spotify.com/track/")) {
      await getSpotifyToken();
      var endString = /[^/]*$/.exec(url)[0];
      if (endString.includes("?")) {
        endString = endString.split("?")[0];
      }
      return await getDataSpotify(endString, guildId); // forward to getDataSpotify() for metadata
    } else if (url.startsWith("soundcloud.com/")) {
      console.log("its soundcloud");
      return await getDataSoundcloud("https://" + url, guildId); // forward to getDataSoundcloud() for metadata
    } else if (url.startsWith("api.soundcloud.com/")) {
      return await getDataSoundcloud("https://" + url, guildId); // forward to getDataSoundcloud() for metadata
    } else if (
      url.startsWith("https://soundcloud.com/") ||
      url.startsWith("https://api.soundcloud.com/")
    ) {
      return await getDataSoundcloud(url, guildId); // forward to getDataSoundcloud() for metadata
    } else {
      console.log("its not soundcloud", url);
      return await getDataUrl(oldUrl, guildId); // forward to getDataUrl() for metadata
    }
    return basic.returnCode(0, "invalid url");
  } else {
    ///////////////////////////////////
    //// checking search results
    ///////////////////////////////////
    async function searchSpotify(string) {
      var data = await spotifyApi.searchTracks(string);
      if (data.body.tracks.items.length == 0) {
        return basic.returnCode(0, "no track");
      }
      var endString = /[^/]*$/.exec(
        data.body.tracks.items[0].external_urls.spotify
      )[0];
      return await getDataSpotify(endString, guildId); // forward to getDataSpotify() for metadata
    }
    async function searchYoutube(string) {
      var filters = await ytsr.getFilters(string);
      var filter = filters.get("Type").get("Video");
      var result = await ytsr(filter.url, { limit: 1 });
      if (result.items.length == 0) return basic.returnCode(0, "no track");
      return await getDataYoutube(result.items[0].id, guildId); // forward to getDataYoutube() for metadata
    }
    async function searchSoundcloud(string) {
      const result = await scdl.search({
        query: string,
        limit: 1,
        offset: 0,
        filter: "tracks",
      });
      if (result.collection.length == 0) return basic.returnCode(0, "no track");
      return await getDataSoundcloud(
        result.collection[0].permalink_url,
        guildId
      );
    }

    var msgParts = url.split(" ");

    if (
      msgParts[0].toLowerCase() == "-sp" ||
      msgParts[0].toLowerCase() == "-spotify"
    ) {
      // checking for spotify search flag
      var i = 2;
      var string = msgParts[1];
      while (i < msgParts.length) {
        string += " " + msgParts[i];
        i++;
      }
      return await searchSpotify(string);
    }
    if (
      msgParts[0].toLowerCase() == "-yt" ||
      msgParts[0].toLowerCase() == "-youtube"
    ) {
      // checking for youtube search flag
      var i = 2;
      var string = msgParts[1];
      while (i < msgParts.length) {
        string += " " + msgParts[i];
        i++;
      }
      return await searchYoutube(string);
    }
    if (
      msgParts[0].toLowerCase() == "-sc" ||
      msgParts[0].toLowerCase() == "-soundcloud"
    ) {
      // checking for soundcloud search flag
      var i = 2;
      var string = msgParts[1];
      while (i < msgParts.length) {
        string += " " + msgParts[i];
        i++;
      }
      return await searchSoundcloud(string);
    }
    var i = 1;
    var string = msgParts[0];
    while (i < msgParts.length) {
      string += " " + msgParts[i];
      i++;
    }
    return await searchSpotify(string); // no search flag specified, default to spotify
  }
}

async function printlog() {
  var Data = await getTrack(
    "https://open.spotify.com/track/0tyXMBNyUjV5oSuctNXZaw?si=395c41074b524a9d",
    897669628279541790
  );
  console.log(Data);
}

//printlog();

module.exports = { getTrack };
