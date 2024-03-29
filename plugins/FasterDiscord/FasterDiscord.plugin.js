/**
 * @name FasterDiscord
 * @authorLink https://github.com/BlueCannonBall
 * @updateUrl https://raw.githubusercontent.com/BlueCannonBall/BetterDiscordStuff/main/plugins/FasterDiscord/FasterDiscord.plugin.js
 * @source https://github.com/BlueCannonBall/BetterDiscordStuff/tree/main/plugins/FasterDiscord
 */

var emptyFunction = function () {};
window._uuid = 0;
window.ongoingTimeouts = {};

function antiSlowEvent() {
    document.onmouseover = emptyFunction;
    let all = document.body.getElementsByTagName("*");

    for (let i = 0, max = all.length; i < max; i++) {
        all[i].onmouseover = emptyFunction;
        all[i].onpointerover = emptyFunction;
    }
}

function timeoutLoop() {
    let removedTimeouts = [];
    for (let timeout in ongoingTimeouts) {
        if (Date.now() >= ongoingTimeouts[timeout].time) {
            ongoingTimeouts[timeout].func(ongoingTimeouts[timeout].args);
            removedTimeouts.push(timeout);
        }
    }
    for (let timeout in removedTimeouts) {
        delete ongoingTimeouts[removedTimeouts[timeout]];
    }
}

module.exports = (() => {
    const config =
    {
        info:
        {
            name: "FasterDiscord",
            authors:
                [
                    {
                        name: "BlueCannonBall",
                        discord_id: "852605214636638260",
                        github_username: "BlueCannonBall",
                    }
                ],
            version: "2.1.8",
            description: "Makes Discord feel faster and more responsive.",
        }
    };

    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }

        getName = () => config.info.name;
        getAuthor = () => config.info.description;
        getVersion = () => config.info.version;

        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => {
                        if (err) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }

        start() {}
        stop() {}
    } : (([Plugin, Api]) => {

        const plugin = (Plugin, Api) => {

            return class FasterDiscord extends Plugin {
                constructor() {
                    super();

                    this.consoleLog = console.log;
                    window._consoleLog = this.consoleLog.bind(console);
                    this.consoleInfo = console.info;
                    this.consoleWarn = console.warn;
                    this.consoleError = console.error;
                    this.consoleDebug = console.debug;
                    this.antiSlowEventInterval = null;
                    setInterval(timeoutLoop, 15);
                    this.badAddEventListener = window.addEventListener;
                    this.badAddEventListenerDocument = document.addEventListener;
                    this.slowTimeout = window.setTimeout;
                    this.clearTimeout = window.clearTimeout;
                }

                onStart() {
                    console.clear()
                    console.log = emptyFunction;
                    console.info = emptyFunction;
                    console.warn = emptyFunction;
                    console.error = emptyFunction;
                    console.debug = emptyFunction;
                    this.antiSlowEventInterval = setInterval(antiSlowEvent, 1000);
                    window.setTimeout = (func, time, ...args) => {
                        let id = window._uuid++;
                        if (time < 0) {
                            func(...args);
                            return id;
                        }
                        window.ongoingTimeouts[id] = {
                            func,
                            time: Date.now() + time,
                            args
                        };
                        return id;
                    };
                    window.clearTimeout = (timeout) => {
                        if (window.ongoingTimeouts[timeout]) {
                            delete window.ongoingTimeouts[timeout];
                        }
                    };
                    window.addEventListener = (...args) => {
                        if (args[0] != 'mouseover' && args[0] != 'pointerover') this.badAddEventListener.bind(window)(...args);
                    };

                    document.addEventListener = (...args) => {
                        if (args[0] != 'mouseover' && args[0] != 'pointerover') this.badAddEventListenerDocument.bind(document)(...args);
                    };
                }

                onStop() {
                    console.log = this.consoleLog;
                    console.info = this.consoleInfo;
                    console.warn = this.consoleWarn;
                    console.error = this.consoleError;
                    console.debug = this.consoleDebug;
                    window.setTimeout = this.slowTimeout;
                    window.clearTimeout = this.clearTimeout;
                    clearInterval(this.antiSlowEventInterval);
                    window.addEventListener = this.badAddEventListener;
                    document.addEventListener = this.badAddEventListenerDocument;
                }
            }
        };

        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
