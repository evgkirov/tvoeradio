if (bridge) {

    bridge.previous.connect(player.control.previous);
    bridge.pause.connect(player.control.pause);
    bridge.next.connect(player.control.next);

} else {

    bridge = {
        started: $.noop,
        stopped: $.noop,
        track_change: $.noop
    };

}