register_namespace('network.stores');

network.stores.itunes_id = '10l3UF';

network.stores.buy_artist_links = function(artist, callback) {
    return;
    $.jsonp({
        'url': 'https://itunes.apple.com/search?callback=?',
        'data': {
            'term': artist,
            'country': 'RU',
            'media': 'music',
            'entity': 'musicArtist',
            'attribute': 'artistTerm',
            'version': 2
        },
        'success': function(data) {
            for (var i = 0; i < data.resultCount; i++) {
                var result = data.results[i];
                if (result.artistName.toLowerCase() == artist.toLowerCase()) {
                    callback({
                        'itunes': result.artistLinkUrl + '&at=' + network.stores.itunes_id
                    });
                    return;
                }
            }
        }
    });
};

network.stores.buy_album_links = function(artist, album, callback) {
    return;
    $.jsonp({
        'url': 'https://itunes.apple.com/search?callback=?',
        'data': {
            'term': artist + ' ' + album,
            'country': 'RU',
            'media': 'music',
            'entity': 'album',
            'version': 2
        },
        'success': function(data) {
            for (var i = 0; i < data.resultCount; i++) {
                var result = data.results[i];
                if ((result.artistName.toLowerCase() == artist.toLowerCase()) && (result.collectionName.toLowerCase() == album.toLowerCase())) {
                    callback({
                        'itunes': result.collectionViewUrl + '&at=' + network.stores.itunes_id
                    });
                    return;
                }
            }
        }
    });
};