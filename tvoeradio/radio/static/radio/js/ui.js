register_namespace('ui');

ui.go_to_page = function(name) {
    $('.page').hide();
    $('#page_'+name).show();
}

ui.resz = function() {
    var ww = $(window).width();
    var wh = $(window).height()
    $('#trackinfo_panel').height(wh-$('#controls').height());
    $('#slider_seek').width(ww-430);
}

ui.show_loader_fullscreen = function() {
    $('#loader_fullscreen').show();
}

ui.hide_loader_fullscreen = function() {
    $('#loader_fullscreen').hide();
}

$(document).ready( function() {
    $(window).resize(ui.resz);
    ui.resz();
});
