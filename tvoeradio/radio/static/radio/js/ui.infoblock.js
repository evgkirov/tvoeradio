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
                'similar': network.lastfm.arrayize(data.artist.similar.artist),
                'tags': network.lastfm.arrayize(data.artist.tags.tag),
                'image': data.artist.image[data.artist.image.length-1]["#text"]
            };
            elem.html(ich.tpl_infoblock_artist(context));
            //var id = 'infoblock_artist' + util.random.randint(0, 100500);
            //elem.find('.infoblock__comments').attr('id', id + '__comments');
            //network.vkontakte.Widgets.Comments(id + '__comments', {autoPublish: 0, limit: 5}, util.string.md5('artist ' + data.artist.name));
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


$('.nav-infoblock').live('click', function(e) {
    e.preventDefault();
    ui.infoblock.show_popup($(this).data('type'), (($(this).data('name'))||$(this).text()));
});


$('a.bbcode_artist').live('click', function(e) {
    e.preventDefault();
    var artist = $(this).attr('href');
    artist = artist.replace('http://www.last.fm/music/', '');
    artist = util.string.urldecode(artist);
    ui.infoblock.show_popup('artist', artist)
});

