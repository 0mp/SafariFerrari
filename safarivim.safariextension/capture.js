function EventManager() {
    this.enabled = true;
    this.registeredEvents = [];
    this.count_one = 0;
    this.count_two = 0;
    this.cmd_one = ' ';
    this.cmd_two = '  ';
}

EventManager.prototype.registerEvent = function EventManager_registerEvent(cmd, func) {
    console.log("event registered!");
    var event_obj = {
        cmd: cmd,
        callback: func
    }

    this.registeredEvents.push(event_obj);
}

EventManager.prototype.matchCommand = function EventManager_matchCommand() {
    console.log('matching');
    var matched = this.registeredEvents.find(function(evt) {
        if (evt.cmd.length == 1) {
            return evt.cmd == this.cmd_one;
        } else /* evt.cmd.length == 2 */ {
            return evt.cmd == this.cmd_two;
        }
    }, this);

    if (!matched)
        return;

    console.log('match found');

    var count = matched.cmd.length == 1 ? this.count_one : this.count_two;
    if (count == 0)
        count = 1;
    matched.callback(count);
    this.count_one = 0;
    this.count_two = 0;
    this.cmd_one = ' ';
    this.cmd_two = '  ';
}

EventManager.prototype.handle = function EventManager_handle(evt) {
    console.log('handle', evt.keyCode);
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
