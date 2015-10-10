function smoothScroll(x, y) {
    var delay = 20;
    var time_offset = 0;
    var step_size = 15;
    var ct = 0;
    var y_modifier = y < 0 ? -1 : 1;
    y = y * y_modifier;
    for (var i = y; i >= step_size; i -= step_size) {
        setTimeout(function() { window.scrollBy(0, y_modifier * step_size); }, delay * ct)
        ct++;
    }
}

var commands = [
	// strzalki
	["h", function(count) { window.scrollBy(-count * 100, 0); }],
	["j", function(count) { smoothScroll(0, 150); }],
    ["k", function(count) { smoothScroll(0, -150); }],
    ["l", function(count) { window.scrollBy(count * 100, 0); }],

    // page up
    ["u", function(count) { window.scrollTo(0,0); }],

    // page down
    ["d", function(count) { window.scrollBy(0, document.body.offsetHeight); }],

    // close tab
    ["x", function(count) {
        safari.self.tab.dispatchMessage("closeTab");
    }],

    // open  tab
    ["X", function(count) {
        safari.self.tab.dispatchMessage("openTab");
    }],

    ["f", function(count) {

    }]
];

commands.forEach(function(cmd) {
	vimsafari.registerEvent(cmd[0], cmd[1]);
})
