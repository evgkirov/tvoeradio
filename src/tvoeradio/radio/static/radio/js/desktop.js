if (window['bridge']) {

    bridge.previous.connect(player.control.previous);
    bridge.pause.connect(player.control.pause);
    bridge.next.connect(player.control.next);

}