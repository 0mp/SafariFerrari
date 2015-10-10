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

var opened = false;
var openedLinks = [];

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
      // alert(opened);
      if (opened) {
        for (var i = 0; i < openedLinks.length; ++i) {
          getElementById(openedLinks[i]).remove();
        }
      } else {
        var links = document.getElementsByTagName("a");
        for(var i = 0; i < links.length; i++) {
          if (links[i].href) {
            var tooltip = document.createElement("div");
            tooltip.id = i;
            tooltip.style.cssText = '\
              border: none;display: inline-block;font: normal;letter-spacing: normal;line-height: normal;margin: 0;padding: 0;text-transform: normal;visibility: visible;width: auto;word-spacing: normal; z-index: auto;\
              clear: none; float: none;\
              background: yellow;\
              width: 20px; height: 20px;\
              position: absolute; top: 2px; left: 2px; bottom: auto;\
              border: 1px solid black; border-radius: 2px;\
              color: black; font-size: 9px !important; text-align: center; vertical-align: middle !important; font-weight: 300;';

            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            for (var j = 0; j < 2; j++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));

            tooltip.innerHTML = text;
            links[i].appendChild(tooltip);

            openedLinks.append(tooltip.id);
          }
        }
      }

      opened = !opened;
    }]
];

commands.forEach(function(cmd) {
	vimsafari.registerEvent(cmd[0], cmd[1]);
})
