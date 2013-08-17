register_namespace('network.stores');


network.stores.buy_album_links = function(artist, album, callback) {
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
                        'itunes': result.collectionViewUrl + '&at=10l3UF'
                    });
                    return;
                }
            }
        }
    });
};