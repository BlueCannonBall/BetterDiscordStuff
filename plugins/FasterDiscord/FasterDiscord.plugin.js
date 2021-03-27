/**
 * @name FasterDiscord
 * @authorLink https://github.com/BlueCannonBall
 * @updateUrl https://raw.githubusercontent.com/BlueCannonBall/BetterDiscordStuff/main/plugins/FasterDiscord/FasterDiscord.plugin.js
 * @source https://github.com/BlueCannonBall/BetterDiscordStuff/tree/main/plugins/FasterDiscord
 */
    
module.exports = (() =>
{
    const config =
    {
        info:
        {
            name: "FasterDiscord",
            authors:
            [
                {
                    name: "BlueCannonBall",
                    discord_id: "460508437160263683",
                    github_username: "BlueCannonBall",
                }
            ],
            version: "1.1.0",
            description: "Makes Discord feel faster and more responsive.",
        }
    };

    return !global.ZeresPluginLibrary ? class
    {
        constructor() { this._config = config; }

        getName = () => config.info.name;
        getAuthor = () => config.info.description;
        getVersion = () => config.info.version;

        load()
        {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () =>
                {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) =>
                    {
                        if (err) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }

        start() { }
        stop() { }
    } : (([Plugin, Api]) => {

        const plugin = (Plugin, Api) =>
        {

            return class FasterDiscord extends Plugin
            {
                constructor()
                {
                    super();
                    this.slowConsoleLog = console.log;
                    this.slowConsoleInfo = console.info;
                    this.slowConsoleWarn = console.warn;
                    this.slowConsoleError = console.error;
                    this.slowConsoleDebug = console.debug;

                    this.fastConsoleLog = function (...args) { };
                }

                onStart()
                {
                    console.clear()
                    console.log = this.fastConsoleLog;
                    console.info = this.fastConsoleLog;
                    console.warn = this.fastConsoleLog;
                    console.error = this.fastConsoleLog;
                    console.debug = this.fastConsoleLog;
                }

                onStop()
                {
                    console.log = this.slowConsoleLog;
                    console.info = this.slowConsoleInfo;
                    console.warn = this.slowConsoleWarn;
                    console.error = this.slowConsoleError;
                    console.debug = this.slowConsoleDebug;
                }
            }
        };

        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
