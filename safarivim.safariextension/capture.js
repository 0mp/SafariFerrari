function EventManager() {
    this.enabled = true;
    this.registeredEvents = [];
    this.registeredLinks = [];
    this.count_one = 0;
    this.count_two = 0;
    this.cmd_one = ' ';
    this.cmd_two = '  ';
}

EventManager.prototype.registerEvent = function EventManager_registerEvent(cmd, func) {
    console.log("event registered!");
    this.registeredEvents.push({ cmd: cmd, callback: func });
}

EventManager.prototype.registerLink = function EventManager_registerEvent(cmd, func) {
    console.log("link registered!");
    this.registeredLinks.push({ cmd: cmd, callback: func });
}

EventManager.prototype.matchCommand = function EventManager_matchCommand() {
    console.log('matching');
    var match;
    var searchArr = this.registeredLinks.length > 0 ?
                        this.registeredLinks :
                        this.registeredEvents;

    matched = searchArr.find(function(evt) {
        return evt.cmd == this.cmd_two || evt.cmd == this.cmd_one;
    }, this);

    if (!matched)
        return;

    console.log('match found');

    var count = matched.cmd.length == 1 ? this.count_one : this.count_two;
    if (count == 0)
        count = 1;
    this.registeredLinks = [];
    matched.callback(count);
    this.count_one = 0;
    this.count_two = 0;
    this.cmd_one = ' ';
    this.cmd_two = '  ';
}

EventManager.prototype.handle = function EventManager_handle(evt) {
    console.log('handle ' +  evt.keyCode);
    if (evt.keyCode >= 48 && evt.keyCode <= 57) {
        var digit = evt.keyCode - 48;
        this.count_one = this.count_one * 10 + digit;
    } else {
        var character = String.fromCharCode(evt.keyCode);
        if (!evt.shiftKey)
            character = character.toLowerCase();
        this.cmd_one = character;
        this.cmd_two = this.cmd_two[1] + character;
        console.log('first: ' + this.cmd_one + ', second: ' + this.cmd_two + ', count_one: ' + this.count_one + ', count_two: ' + this.count_two);
        this.matchCommand();
        this.count_two = this.count_one;
        this.count_one = 0;
    }
}

window.vimsafari = new EventManager();
vimsafari.pressed = undefined;

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (document.activeElement.tagName != 'INPUT' &&
        document.activeElement.tagName != 'TEXTAREA' &&
        document.activeElement.tagName != 'SELECT' &&
        evt.keyIdentifier != "Meta" &&
        evt.keyIdentifier != "Shift" &&
        evt.keyIdentifier != "Control" &&
        vimsafari.pressed == undefined) {
        vimsafari.handle(evt);
        // vimsafari.pressed = setInterval(function () { vimsafari.handle(evt); }, 800);
    }
};

document.onkeyup = function(evt) {
    clearInterval(vimsafari.pressed);
    vimsafari.pressed = undefined;
}
