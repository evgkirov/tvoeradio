register_namespace('ui.infoblock');


ui.infoblock.show_artist = function(elem, name) {
    network.lastfm.api(
        'artist.getInfo',
        {
            'artist': name
        },
        function(data) {
            var context = {
                'name': data.artist.name,
                'bio_summary': data.artist.bio.summary,
                'bio': data.artist.bio.content,
                'similar': network.lastfm.arrayize(data.artist.similar.artist),
                'tags': network.lastfm.arrayize(data.artist.tags.tag),
                'image': data.artist.image[data.artist.image.length-1]["#text"],
                'stations': [
                    {
                        'type': 'similar',
                        'name': data.artist.name,
                        'html': player.station.similar.get_html(data.artist.name)
                    }
                ]
            };
            elem.html(ich.tpl_infoblock_artist(context));
            // TODO template
            $('.infoblock__text a').each(function(){
                var html = '<span>' + $(this).text() + '</span>';
                if ($(this).hasClass('bbcode_artist')) {
                    var artist = $(this).attr('href');
                    artist = artist.replace('http://www.last.fm/music/', '');
                    artist = util.string.urldecode(artist);
                    html = '<span class="pseudolink nav-infoblock" data-type="artist" data-name="' + artist + '">' + $(this).text() + '</span>'
                }
                $(html).insertAfter($(this));
                $(this).remove();
            });
            //var id = 'infoblock_artist' + util.random.randint(0, 100500);
            //elem.find('.infoblock__comments').attr('id', id + '__comments');
            //network.vkontakte.Widgets.Comments(id + '__comments', {autoPublish: 0, limit: 5}, util.string.md5('artist ' + data.artist.name));
        }
    );
};


ui.infoblock.show = function(elem, type, name) {
    elem.html('<div class="infoblock-loader"></div>');
    ui.infoblock['show_' + type](elem, name);
};


ui.infoblock.show_popup = function(type, name) {
    ui.popup.show(name);
    ui.infoblock.show($('.popup .popup__content'), type, name);
};


$('.nav-infoblock').live('click', function(e) {
    e.preventDefault();
    ui.infoblock.show_popup($(this).data('type'), (($(this).data('name'))||$(this).text()));
});



