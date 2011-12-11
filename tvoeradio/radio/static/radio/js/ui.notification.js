register_namespace('ui.notification');

ui.notification.timeout = 0;


ui.notification.show = function(type, text, permanent) {
    var n = $('#notification');

    n.text(text).attr('class', type).css('top', 46 + Math.floor((117 - n.outerHeight())/2));
    $('#notification:hidden').fadeIn('fast');
    ui.notification.clear_timeout();
    if (!permanent) {
        ui.notification.timeout = window.setTimeout(ui.notification.hide, 3000);
    }
};


ui.notification.hide = function() {
    $('#notification:visible').fadeOut('fast');
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