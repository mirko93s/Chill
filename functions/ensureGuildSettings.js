/**
 * @param {Client} client 
 * @param {Object} guild 
 * @description adds guild to database on join with default settings
 */
module.exports = function (client, guild) {
    const defaultSettings = {
        prefix: ".",
        musicchannelonly: "false",
        xpcooldown: 5,
        autodeletecmds: "true",
        xpmodule: "true",
        welcomemessage: "true",
        welcomerole: "true",
        djrequired: "true",
        autovocalchannels: [],
        autovocalcloned: [],
        disabledcommands: [],
        xp: {},
        customcmd: {},
        rewards: {},
        reactionroles: {}
    }
    client.settings.ensure(guild, defaultSettings);
}