/**
 * @param {Object} msg
 * @param {Object} author
 * @param {Number} time 
 * @param {Array} validReactions 
 * @returns first reaction clicked
 */
module.exports = async function (msg, author, time, validReactions) {
    time *= 1000;
    for (const reaction of validReactions) await msg.react(reaction); //add reactions in order
    const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
    return msg
        .awaitReactions({filter, max: 1, time: time})
        .then(collected => collected.first() && collected.first().emoji.name);
}