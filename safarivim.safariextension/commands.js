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

vimsafari.opened = false;
vimsafari.openedLinks = [];

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

    // reopen tab
    ["X", function(count) {
        safari.self.tab.dispatchMessage("reopenClosedTab");
    }],

    ["f", function(count) {
        var openedLinks = vimsafari.openedLinks;
        var opened = vimsafari.opened;

        function removeOpenedLinks() {
            Element.prototype.remove = function() {
                this.parentElement.removeChild(this);
            }
            NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
                for(var i = this.length - 1; i >= 0; i--) {
                    if(this[i] && this[i].parentElement) {
                        this[i].parentElement.removeChild(this[i]);
                    }
                }
            }

            for (var i = 0; i < openedLinks.length; ++i) {
                document.getElementById(openedLinks[i]).remove();
            }

            vimsafari.openedLinks = [];
        }

        if (opened === true) {
            removeOpenedLinks();
        } else {
            var links = document.getElementsByTagName("a");
            var currentCommands = commands.length;

            var combinations = {};
            for (var i = 0; i < links.length; i++) {
                if (links[i].href) {
                    var tooltip = document.createElement("div");
                    tooltip.id = i;
                    tooltip.style.cssText = '\
                      text-indent: 0; border: none;display: block;font: normal;letter-spacing: normal;line-height: normal;margin: 0;padding: 0;text-transform: normal;visibility: visible;width: auto;word-spacing: normal; z-index: auto;\
                      clear: none; float: none;\
                      background: yellow;\
                      width: 20px; height: 20px;\
                      position: absolute; top: 2px; left: 2px; bottom: auto;\
                      border: 1px solid black; border-radius: 2px;\
                      color: black; font-size: 9px !important; text-align: center; vertical-align: middle !important; font-weight: 300;';

                    var text = "";
                    var possible = "abcegimnopqrstvwyz"; // BCEGIMNOPQRSTVWYZ

                    // check if combination is unique
                    while (combinations[text]) {
                        text = "";
                        for (var j = 0; j < 2; j++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }

                        // TODO: check if 26^2 combinations have not been used
                    }

                    combinations[text] = true;

                    tooltip.innerHTML = text;
                    links[i].appendChild(tooltip);
                    openedLinks.push(tooltip.id);

                    vimsafari.registerLink(text, (function(url) {
                        return function(count) {
                            safari.self.tab.dispatchMessage("openTabWithLink", url);

                            removeOpenedLinks();
                            // TODO: remove registeredEvents
                        }
                    })(links[i].href));
                }
            }
        }

        vimsafari.opened = !vimsafari.opened;
    }]
];

commands.forEach(function(cmd) {
	vimsafari.registerEvent(cmd[0], cmd[1]);
})
