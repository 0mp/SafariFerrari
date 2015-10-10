var commands = [
  // strzalki
  ["h", function(count) { window.scrollBy(-count * 100, 0); }],
  ["j", function(count) { window.scrollBy(0, count * 100); }],
  ["k", function(count) { window.scrollBy(0, -count * 100); }],
  ["l", function(count) { window.scrollBy(count * 100, 0); }],

  // page up
  ["u", function(count) { window.scrollTo(0,0); }],

  // page down
  ["d", function(count) { window.scrollBy(0, document.body.offsetHeight); }],

  // close tab
  ["x", function(count) {
    safari.self.tab.dispatchMessage("closeTab");
  }],

  // open tab
  ["X", function(count) {
    safari.self.tab.dispatchMessage("openTab");
  }],

  ["f", function(count) {

  }]
];

commands.forEach(function(cmd) {
	vimsafari.registerEvent(cmd[0], cmd[1]);
})
