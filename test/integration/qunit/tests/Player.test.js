
var player;
var song;

QUnit.testStart(function() {
  player = new Player();
  song = new Song();
});

test("should be able to play a Song", function() {
  player.play(song);
  ok(player.currentlyPlayingSong==song);
});

test("should indicate that the song is currently paused", function() {
  player.play(song);
  player.pause();
  ok(!player.isPlaying);
});

test("should be possible to resume", function() {
  player.play(song);
  player.pause();
  player.resume();
  ok(player.isPlaying);
  ok(player.currentlyPlayingSong==song);
});
  
