register_namespace('ui.notification');

ui.notification.timeout = 0;


ui.notification.show = function(type, text, allow_html) {
    var n = $('#notification');
    if ((n.is(':visible')) && (n.hasClass('permanent'))) {
        return;
    }
    n[allow_html ? 'html' : 'text'](text).attr('class', type).css({
        'top': 46 + Math.floor((117 - n.outerHeight())/2)//,
        //'margin-left': -Math.floor(n.outerWidth()/2)
    });
    $('#notification:hidden').fadeIn('fast');
    ui.notification.clear_timeout();
    if (type.indexOf('permanent') === -1) {
        ui.notification.timeout = window.setTimeout(ui.notification.hide, 3000);
    }
};


ui.notification.hide = function() {
    $('#notification:visible').not('.unclosable').fadeOut('fast');
    ui.notification.clear_timeout();
};

ui.notification.clear_timeout = function() {
    if (ui.notification.timeout) {
        window.clearTimeout(ui.notification.timeout);
        ui.notification.timeout = 0;
    }
};

$(document).ready(function() {
    $('#notification').click(ui.notification.hide);
});