register_namespace('ui.infoblock');


ui.infoblock.show_artist = function(elem, name) {
    network.lastfm.api(
        'artist.getInfo',
        {
            'artist': name
        },
        function(data) {
            var id = 'infoblock_artist' + util.random.randint(0, 100500);
            var $block = $('#infoblock_artist_template').clone(false).attr('id', id);
            $block.find('.infoblock__header').text(data.artist.name);
            $block.find('.infoblock__text').html(data.artist.bio.summary);
            $block.find('.infoblock__comments').attr('id', id + '__comments');
            $block.find('.infoblock_artist__picture').load(function() { /*ui.fit()*/ })
                                                     .attr('src', data.artist.image[data.artist.image.length-1]["#text"]);
            $block.find('.greenbutton').click(function(){
                player.control.start('similar_artists', data.artist.name);
            });
            elem.html('');
            $block.appendTo(elem);
            //network.vkontakte.Widgets.Comments(id + '__comments', {autoPublish: 0, limit: 5}, util.string.md5('artist ' + name));
        }
    );
};


ui.infoblock.show = function(elem, type, name) {
    elem.html('<div class="infoblock-loader"></div>');
    this.show_artist(elem, name);
};
