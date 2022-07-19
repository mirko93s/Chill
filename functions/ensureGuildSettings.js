/**
 * @param {Client} client
 * @param {Object} guild
 * @description adds guild to database on join with default settings
 */
module.exports = function(client, guild) {
	const defaultSettings = {
		// channels
		welcomechannel: null,
		bcchannel: null,
		puchannel: null,
		reportchannel: null,
		gachannel: null,
		pollchannel: null,
		musictextchannel: null,
		musicvocalchannel: null,
		ticketcategory: null,
		// roles
		musictemprole: null,
		djrole: null,
		supportrole: null,
		roleonjoin: null,
		// toggles
		musicchannelonly: `false`,
		autodeletecmds: `true`,
		xpmodule: `true`,
		welcomemessage: `true`,
		welcomerole: `true`,
		djrequired: `true`,
		// other
		prefix: `.`,
		xpcooldown: 5,
		// array & objects
		autovocalchannels: [],
		autovocalcloned: [],
		disabledcommands: [],
		xp: {},
		customcmd: {},
		rewards: {},
		reactionroles: {},
	};
	client.settings.ensure(guild, defaultSettings);
};
