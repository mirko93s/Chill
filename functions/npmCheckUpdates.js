module.exports = async function() {
	const ncu = require(`npm-check-updates`);
	ncu.run({
		packageFile: `./package.json`,
		upgrade: false,
		reject: `node-fetch`,
		silent: true,
	}).then(packages => {
		if (Object.keys(packages).length > 0) return console.log(`\u001b[48;5;130m\u001b[38;5;226m OUT OF DATE \u001b[0m \u001b[38;5;202m${Object.keys(packages).length} dependenc${Object.keys(packages).length > 1 ? `ies are` : `y is`} outdated!\u001b[0m`);
	});
};