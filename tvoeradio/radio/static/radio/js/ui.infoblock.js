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
            var similar = [];
            var data_similar = network.lastfm.arrayize(data.artist.similar.artist);
            for (var i in data_similar) {
                similar.push('<a href="#" class="artist">' + util.string.htmlspecialchars(data_similar[i].name) + '</a>');
            }
            var html = similar.join(', ');
            if (similar) {
                html = 'Похожие исполнители: ' + html;
            }
            $block.find('.infoblock__similar').html(html);
            var tags = [];
            var data_tags = network.lastfm.arrayize(data.artist.tags.tag);
            for (var i in data_tags) {
                tags.push('<a href="#" class="tag">' + util.string.htmlspecialchars(data_tags[i].name) + '</a>');
            }
            var html = tags.join(', ');
            if (tags) {
                html = 'Теги: ' + html;
            }
            $block.find('.infoblock__tags').html(html);
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


ui.infoblock.show_popup = function(type, name) {
    $('#popup_infoblock').show();
    ui.infoblock.show($('#popup_infoblock .popup__content'), type, name);
};


$('.link-artist').live('click', function(e){
    e.preventDefault();
    ui.infoblock.show_popup('artist', (($(this).data('name'))||$(this).text()));
});

$('.link-tag').live('click', function(e){
    e.preventDefault();
    ui.infoblock.show_popup('tag', (($(this).data('name'))||$(this).text()));
});

$('a.bbcode_artist').live('click', function(e) {
    e.preventDefault();
    var artist = $(this).attr('href');
    artist = artist.replace('http://www.last.fm/music/', '');
    artist = util.string.urldecode(artist);
    ui.infoblock.show_popup('artist', artist)
});