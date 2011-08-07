register_namespace('ui.infoblock');


ui.infoblock.show_artist = function(elem, name) {
    network.lastfm.api(
        'artist.getInfo',
        {
            'artist': name
        },
        function(data) {
            var $block = $('#infoblock_artist_template').clone(false).attr('id', '');
            $block.find('.infoblock__header').text(data.artist.name);
            $block.find('.infoblock__text').html(data.artist.bio.summary);
            $block.find('.infoblock_artist__picture').load(function() { /*ui.fit()*/ })
                                                     .attr('src', data.artist.image[data.artist.image.length-1]["#text"]);
            $block.find('.greenbutton').click(function(){
                player.control.start('similar_artists', data.artist.name);
            });
            elem.html('');
            $block.appendTo(elem);
        }
    );
};


ui.infoblock.show = function(elem, type, name) {
    elem.html('<div class="infoblock-loader"></div>');
    this.show_artist(elem, name);
};
