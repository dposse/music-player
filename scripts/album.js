var createSongRow = function (songNumber, songName, songLength) {
  var template =
     '<tr class="album-view-song-item">'
   + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
   + '  <td class="song-item-title">' + songName + '</td>'
   + '  <td class="song-item-duration">' + songLength + '</td>'
   + '</tr>'
   ;

   var $row = $(template);

  var handleSongClick = function () {
    
    var clickedSongNumber = $(this).attr('data-song-number');
    
    //1 there is a song that is currently playing
    if (currentlyPlayingSongNumber !== null) {
      var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }

    //2 there is a song currently playg, but a different one was clicked to play
    if (clickedSongNumber !== currentlyPlayingSongNumber && songPaused === null) {
      currentlyPlayingSongNumber = clickedSongNumber;

      setSong(songNumber);
      
      currentSoundFile.play();

      $(this).html(pauseButtonTemplate);
    }

    //3 the currently playing song was clicked

    else {

      songPaused = (songPaused) ? false : true;

      currentSoundFile.togglePlay();
      currentlyPlayingSongNumber = null;
      $(this).html(clickedSongNumber);
    }

  };

   var onHover = function () {
     var songItem = $(this).find('.song-item-number');
     var songNumber = songItem.attr('data-song-number');

     if (songNumber !== currentlyPlayingSongNumber) {
       songItem.html(playButtonTemplate);
     }
   };

   var offHover = function () {
     var songItem = $(this).find('.song-item-number');
     var songNumber = songItem.attr('data-song-number');

     if (songNumber !== currentlyPlayingSongNumber) {
      songItem.html(songNumber);
     }
   };

   $row.find('.song-item-number').click(handleSongClick);
   $row.hover(onHover, offHover);

   return $row;
};

var setCurrentAlbum = function(album) {
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $songRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($songRow);
  }
};

var setSong = function (songNumber) {

  if (currentSoundFile)
    currentSoundFile.stop();

  currentSoundFile = new buzz.sound(albums[albumNumber].songs[songNumber-1].audioUrl, {
    formats: ['mp3'],
    preload: true,
  });

};

var currentSoundFile = null;
var currentlyPlayingSongNumber = null;
var songPaused = null;
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

const albumNumber = Math.round(Math.random());

setCurrentAlbum(albums[albumNumber]);