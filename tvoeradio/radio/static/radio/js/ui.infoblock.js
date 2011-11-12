register_namespace('ui.infoblock');


ui.infoblock.convert_wiki = function (elem) {
    elem.find('a').each(function(){
        var html = '<span>' + $(this).text() + '</span>';
        if ($(this).hasClass('bbcode_artist')) {
            var artist = $(this).attr('href');
            artist = artist.replace('http://www.last.fm/music/', '');
            artist = util.string.urldecode(artist);
            html = '<span class="pseudolink nav-infoblock" data-type="artist" data-name="' + artist + '">' + $(this).text() + '</span>'
        }
        if ($(this).hasClass('bbcode_tag')) {
            var tag = $(this).attr('href');
            tag = tag.replace('http://www.last.fm/tag/', '');
            tag = util.string.urldecode(tag);
            html = '<span class="pseudolink nav-infoblock" data-type="tag" data-name="' + tag + '">' + $(this).text() + '</span>'
        }
        $(html).insertAfter($(this));
        $(this).remove();
    });
};


ui.infoblock.show_artist = function(elem, name) {
    network.lastfm.api(
        'artist.getInfo',
        {
            'artist': name
        },
        function(data) {
            var context = {
                'name': data.artist.name,
                'wiki_summary': data.artist.bio.summary,
                'wiki': data.artist.bio.content,
                'similar': network.lastfm.arrayize(data.artist.similar.artist),
                'tags': network.lastfm.arrayize(data.artist.tags.tag),
                'image': network.lastfm.select_image(data.artist.image, 'large'),
                'lastfm_url': data.artist.url,
                'stations': [
                    {
                        'type': 'similar',
                        'name': data.artist.name,
                        'html': player.station.similar.get_html(data.artist.name)
                    },
                    {
                        'type': 'artist',
                        'name': data.artist.name,
                        'html': player.station.artist.get_html(data.artist.name)
                    },
                ]
            };
            elem.html(ich.tpl_infoblock_artist(context));
            ui.infoblock.convert_wiki($('.infoblock__wiki'));
            var id = 'infoblock_artist' + util.random.randint(0, 100500);
            elem.find('.infoblock__comments').attr('id', id + '__comments');
            network.vkontakte.Widgets.Comments(id + '__comments', {autoPublish: 0, limit: 5}, util.string.md5('artist ' + data.artist.name));
        }
    );
};


ui.infoblock.show_tag = function(elem, name) {
    network.lastfm.api(
        'tag.getInfo',
        {
            'tag': name
        },
        function(data) {
            var context = {
                'name': data.tag.name,
                'wiki_summary': data.tag.wiki.summary,
                'wiki': data.tag.wiki.content,
                'lastfm_url': data.tag.url,
                'stations': [
                    {
                        'type': 'tag',
                        'name': data.tag.name,
                        'html': player.station.tag.get_html(data.tag.name)
                    }
                ]
            };
            elem.html(ich.tpl_infoblock_tag(context));
            ui.infoblock.convert_wiki($('.infoblock__wiki'));
        }
    );
};


ui.infoblock.show_user = function(elem, name) {
    network.lastfm.api(
        'user.getInfo',
        {
            'user': name
        },
        function(data) {
            var context = {
                'name': data.user.name,
                'image': network.lastfm.select_image(data.user.image, 'large'),
                'lastfm_url': data.user.url,
                'stations': [
                    {
                        'type': 'library',
                        'name': data.user.name,
                        'html': player.station.library.get_html(data.user.name)
                    }
                ]
            };
            elem.html(ich.tpl_infoblock_user(context));
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


