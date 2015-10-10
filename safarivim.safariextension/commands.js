vimsafari.openedLinks = [];

function smoothScroll(x, y, step_scale) {
    var step_scale = step_scale || 1;
    var delay = 20;
    var time_offset = 0;
    var step_size = 25 * step_scale;
    var ct = 0;
    var y_modifier = y < 0 ? -1 : 1;
    y = y * y_modifier;
    for (var i = y; i >= step_size; i -= step_size) {
        setTimeout(function() { window.scrollBy(0, y_modifier * step_size); }, delay * ct)
        ct++;
    }
    setTimeout(function() { window.scrollBy(0, y_modifier * i); }, delay * ct);
}

function removeOpenedLinkTooltips() {
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

    for (var i = 0; i < vimsafari.openedLinks.length; ++i) {
        vimsafari.openedLinks[i].remove();
    }

    vimsafari.openedLinks = [];
}

function generateTooltipText(combinations) {
    var text = "";
    var possible = "abcegimnopqrstvwyz"; // BCEGIMNOPQRSTVWYZ

    // check if combination is unique
    while (combinations[text] || text === "") {
        text = "";
        for (var j = 0; j < 2; j++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        // TODO: check if 26^2 combinations have not been used
    }

    return text;
}

function displayLinkTooltips(count) {
    var links = document.getElementsByTagName("a");

    var combinations = {};
    for (var i = 0; i < links.length; i++) {
        if (links[i].href) {
            var tooltip = document.createElement("div");
            tooltip.style.cssText = '\
              text-indent: 0; border: none;display: block;font: normal;letter-spacing: normal;line-height: normal;margin: 0;padding: 0;text-transform: normal;visibility: visible;width: auto;word-spacing: normal; z-index: auto;\
              clear: none; float: none;\
              background: yellow;\
              width: 20px; height: 20px;\
              position: absolute; top: 2px; left: 2px; bottom: auto;\
              border: 1px solid black; border-radius: 2px;\
              color: black; font-size: 9px !important; text-align: center; vertical-align: middle !important; font-weight: 300;\
            ';

            var text = generateTooltipText(combinations);

            combinations[text] = true;

            tooltip.innerHTML = text;
            links[i].appendChild(tooltip);
            vimsafari.openedLinks.push(tooltip);

            vimsafari.registerLink(text, (function(url) {
                return function(count) {
                    safari.self.tab.dispatchMessage("openTabWithLink", url);

                    removeOpenedLinkTooltips();
                }
            })(links[i].href));
        }
    }

    vimsafari.registerLink("f", function() {
        removeOpenedLinkTooltips();
    });
}


var commands = [
    // strzalki
    ["h", function(count) { window.scrollBy(-count * 100, 0); }],
    ["j", function(count) { smoothScroll(0, 150); }],
    ["k", function(count) { smoothScroll(0, -150); }],
    ["l", function(count) { window.scrollBy(count * 100, 0); }],

    // page up
    ["u", function(count) { smoothScroll(0,-400, 3); }],

    // page down
    ["d", function(count) { smoothScroll(0, 400, 3); }],

    // close tab
    ["x", function(count) {
        safari.self.tab.dispatchMessage("closeTab");
    }],

    // reopen tab
    ["X", function(count) {
        safari.self.tab.dispatchMessage("reopenClosedTab");
    }],

    ["f", displayLinkTooltips],

    ["[[", function(count) {
        var links = document.getElementsByTagName("a");

        // go through all links in page
        for (var i = 0; i < links.length; ++i) {
            if (links[i].href) {
                if (links[i].id == "pnprev") {
                    safari.self.tab.dispatchMessage("openLinkInCurrentTab", links[i].href);
                    break;
                }
            }
        }
    }],

    ["]]", function(count) {
        var links = document.getElementsByTagName("a");

        // go through all links in page
        for (var i = 0; i < links.length; ++i) {
            if (links[i].href) {
                if (links[i].id == "pnnext") {
                    safari.self.tab.dispatchMessage("openLinkInCurrentTab", links[i].href);
                    break;
                }
            }
        }
    }],

    ["gg", function(count) {
      console.log(parseInt(window.scrollY / 100));
        smoothScroll(0, -window.scrollY, parseInt(window.scrollY / 130));
    }]
];

commands.forEach(function(cmd) {
	vimsafari.registerEvent(cmd[0], cmd[1]);
})
