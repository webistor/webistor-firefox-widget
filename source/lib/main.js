/**
 * The main module of the webistor Add-on.
 *
 * Widget documentation: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/widget.html
 * Tabs documentation: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/tabs.html
 */

// We want a widget that opens a new tab, so: include widget` and `tabs` modules.
var Widget = require("widget").Widget;
var tabs = require('tabs');

exports.main = function() {

    new Widget({

        id: "webistor-basis-widget",
        label: "Save this page to Webistor",

        contentURL: "http://www.webistor.net/favicon.ico",

        // Add a function to trigger when the Widget is clicked.
        onClick: function(event) {

            // Open a new tab in the currently active window.
            tabs.open({
              url: "http://www.webistor.net/add?title="+encodeURIComponent(tabs.activeTab.title)+"&url="+encodeURIComponent(tabs.activeTab.url),
              inNewWindow: false
            });

        }
    });
};
