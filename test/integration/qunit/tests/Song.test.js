var song;

QUnit.testStart(function() {
    song = new Song();
});

test("should be true", function() {
    ok(song.persistFavoriteStatus());
});
