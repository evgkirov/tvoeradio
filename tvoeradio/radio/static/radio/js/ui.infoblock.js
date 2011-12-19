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


ui.infoblock.add_comments = function(elem, type, name) {
    var title = 'Твоёрадио: информация о ' + name;
    var hash = 'info/' + type + '/' + util.string.urlencode(name)
    var url = config.vk_api_url + '#' + hash;
    var hash = util.string.md5(type + ' ' + name)
    var id = 'infoblock_' + type + util.random.randint(0, 100500);
    elem.find('.infoblock__comments').attr('id', id + '__comments');
    network.vkontakte.Widgets.Comments(
        id + '__comments',
        {
            'autoPublish': 0,
            'limit': 5,
            'pageTitle': title,
            'pageUrl': url
        },
        hash
    );
}


ui.infoblock.show_artist = function(elem, name) {
    network.lastfm.api(
        'artist.getInfo',
        {
            'artist': name,
            'lang': 'ru'
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
                'lastfm_url_text': util.string.urldecode(data.artist.url),
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
                    }
                ]
            };
            elem.html(ich.tpl_infoblock_artist(context));
            ui.infoblock.convert_wiki($('.infoblock__wiki'));
            ui.infoblock.add_comments(elem, 'artist', name);
        }
    );
};


ui.infoblock.show_tag = function(elem, name) {
    network.lastfm.api(
        'tag.getInfo',
        {
            'tag': name,
            'lang': 'ru'
        },
        function(data) {
            var context = {
                'name': data.tag.name,
                'wiki_summary': data.tag.wiki.summary,
                'wiki': data.tag.wiki.content,
                'lastfm_url': data.tag.url,
                'lastfm_url_text': util.string.urldecode(data.tag.url),
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
            ui.infoblock.add_comments(elem, 'tag', name);

            network.lastfm.api(
                'tag.getTopArtists',
                {
                    'tag': name,
                    'limit': 25
                },
                function(data) {
                    context['top_artists'] = [];
                    var artists = context['artists'] = network.lastfm.arrayize(data.topartists.artist);
                    for (var i = 0; i < 4; i++) {
                        context['top_artists'].push({
                            'name': artists[i].name,
                            'image': network.lastfm.select_image(artists[i].image, 'medium', true)
                        });
                    }
                    var html = ich.tpl_infoblock_tag(context).find('.infoblock__artists').html();
                    elem.find('.infoblock__artists').html(html);
                    var html = ich.tpl_infoblock_tag(context).find('.infoblock__photos').html();
                    elem.find('.infoblock__photos').html(html);
                }
            );

            network.lastfm.api(
                'tag.getSimilar',
                {
                    'tag': name
                },
                function(data) {
                    context['tags'] = network.lastfm.arrayize(data.similartags.tag).splice(0, 10);
                    var html = ich.tpl_infoblock_tag(context).find('.infoblock__tags').html();
                    elem.find('.infoblock__tags').html(html);
                }
            );

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
                'lastfm_url_text': util.string.urldecode(data.user.url),
                'it_is_you': (data.user.name == network.lastfm.user),
                'stations': [
                    {
                        'type': 'library',
                        'name': data.user.name,
                        'html': player.station.library.get_html(data.user.name)
                    },
                    {
                        'type': 'loved',
                        'name': data.user.name,
                        'html': player.station.loved.get_html(data.user.name)
                    }
                ]
            };
            if (data.user.name == network.lastfm.user) {
                context['stations'].push({
                    'type': 'recommendations',
                    'name': data.user.name,
                    'html': player.station.recommendations.get_html(data.user.name)
                });
            }
            elem.html(ich.tpl_infoblock_user(context));

            network.lastfm.api(
                'user.getTopArtists',
                {
                    'user': name,
                    'period': 'overall',
                    'limit': 16
                },
                function(data) {
                    var artists = network.lastfm.arrayize(data.topartists.artist);
                    context['artists'] = [];
                    for (var i = 0; i < artists.length; i++) {
                        context['artists'].push({
                            'name': artists[i].name,
                            'image': network.lastfm.select_image(artists[i].image, 'medium', true)
                        });
                    }
                    elem.html(ich.tpl_infoblock_user(context));
                }
            );
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


