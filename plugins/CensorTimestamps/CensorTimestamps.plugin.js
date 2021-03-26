/**
 * @name CensorTimestamps
 * @authorLink https://github.com/BlueCannonBall
 * @updateUrl https://raw.githubusercontent.com/BlueCannonBall/BetterDiscordStuff/main/plugins/CensorTimestamps/CensorTimestamps.plugin.js
 * @source https://github.com/BlueCannonBall/BetterDiscordStuff/tree/main/plugins/CensorTimestamps
 */

function censorTimestamps () {
    let all = document.getElementsByClassName("timestamp-3ZCmNB");
    for (idx in all) {
        if (all[idx].textContent.includes('/') || all[idx].textContent.includes('Today at ') || all[idx].textContent.includes('Yesterday at ')) {
            all[idx].style.color = "#202225";
            all[idx].style.backgroundColor = "#202225";
            all[idx].style['border-radius'] = "3px";
        } else {
            all[idx].style.color = "#00000000";
        }
    };
}
    
module.exports = (() =>
{
    const config =
    {
        info:
        {
            name: "CensorTimestamps",
            authors:
            [
                {
                    name: "BlueCannonBall",
                    discord_id: "460508437160263683",
                    github_username: "BlueCannonBall",
                }
            ],
            version: "0.1.0",
            description: "Censors all timestamps unless hovered over.",
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

            return class AvatarIconViewer extends Plugin
            {
                constructor()
                {
                    super();
                    this.interval = null;
                }

                onStart()
                {
                    this.interval = setInterval(censorTimestamps, 1500);
                }

                onStop()
                {
                    clearInterval(this.interval);
                }

                // onMessage()
                // {
                //     censorTimestamps();
                // }
            }
        };

        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
