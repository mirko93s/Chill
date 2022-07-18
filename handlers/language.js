module.exports = (guild_Lang, type, key) => {

	let lang;
	// check if lang file exists
	if (require(`fs`).existsSync(`./languages/${guild_Lang}.js`)) {
		lang = require(`../languages/${guild_Lang}.js`);
		if (!lang[type][key]) { // lang exists but key is not there, so we fallback to english-dev
			lang = require(`../languages/en-dev.js`);
		}
	} else { // lang doesnt exits fallback to english-dev
		lang = require(`../languages/en-dev.js`);
	}
	return lang[type][key];
};