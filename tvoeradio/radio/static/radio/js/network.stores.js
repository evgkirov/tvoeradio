register_namespace('network.stores');


network.stores.buy_album_links = function(artist, album, callback) {
    $.getJSON(
        '/app/_/buy_album_links/',
        {
            'artist': artist,
            'album': album
        },
        callback
    );
};