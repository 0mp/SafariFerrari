function EventManager() {
    this.enabled = true;
    this.registeredEvents = [];
    this.count_one = 0;
    this.count_two = 0;
    this.cmd_one = ' ';
    this.cmd_two = '  ';
}

EventManager.prototype.registerEvent = function EventManager_registerEvent(cmd, func) {
    var event_obj = {
        cmd: cmd,
        callback: func
    }

    this.registeredEvents.push(event_obj);
}

EventManager.prototype.matchCommand = function EventManager_matchCommand() {
    var matched = this.registeredEvents.find(function(evt) {
        if (evt.cmd.length == 1) {
            return evt.cmd == this.cmd_one;
        } else /* evt.cmd.length == 2 */ {
            return evt.cmd == this.cmd_two;
        }
    }, this);

    if (!matched)
        return;

    var count = matched.cmd.length == 1 ? this.count_one : this.count_two;
    matched.callback(count);
    this.count_one = 0;
    this.count_two = 0;
    this.cmd_one = ' ';
    this.cmd_two = '  ';
}

EventManager.prototype.handle = function EventManager_handle(evt) {
    if (evt.keyCode >= 48 && evt.keyCode <= 57) {
        var digit = evt.keyCode - 48;
        this.count_one = this.count_one * 10 + digit;
    } else {
        var character = String.fromCharCode(evt.keyCode);
        this.cmd_one = character;
        this.cmd_two = this.cmd_two[1] + character;
        //console.log('first: ' + this.cmd_one + ', second: ' + this.cmd_two + ', count_one: ' + this.count_one + ', count_two: ' + this.count_two);
        this.count_two = this.count_one;
        this.count_one = 0;
    }
    this.matchCommand();
}

window.vimsafari = new EventManager();

document.onkeypress = function(evt) {
    evt = evt || window.event;
    if (document.activeElement.tagName != 'INPUT' &&
        document.activeElement.tagName != 'TEXTAREA' &&
        document.activeElement.tagName != 'SELECT') {
        manager.handle(evt);
    }
};

