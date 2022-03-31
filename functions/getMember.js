/**
 * @param {Object} msg
 * @param {Object} toFind
 * @returns member name or object
 */
module.exports = function(msg, toFind = ``) {
	toFind = toFind.toLowerCase();

	let target = msg.guild.members.cache.get(toFind);

	if (!target && msg.mentions.members) target = msg.mentions.members.first();

	if (!target && toFind) {
		target = msg.guild.members.cache.find(member => {
			return member.displayName.toLowerCase().includes(toFind) ||
            member.user.tag.toLowerCase().includes(toFind);
		});
	}

	if (!target) target = msg.member;

	return target;
};