const { MessageEmbed } = require("discord.js");
const { promptMessage } = require("../../functions.js");

const chooseArr = ["🗻", "📰", "✂"];

module.exports = {
    name: "rockpaperscissors",
    aliases: ["rps"],
    category: "Fun",
    description: "Rock Paper Scissors",
    usage: "rockpaperscissors\n**e.g.**\n\`rockpaperscissors\`\n> Play a rock-paper-scissors game with the Bot",
    run: async (client, msg, arg) => {

        const embed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setFooter(msg.author.username, msg.author.displayAvatarURL())
            .setDescription("React to play!")

        const m = await msg.channel.send({embeds:[embed]});
        const reacted = await promptMessage(m, msg.author, 30, chooseArr);
        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];
        const result = await getResult(reacted, botChoice);
        await m.reactions.removeAll();

        embed
            .setDescription("")
            .addField(result, `${reacted} vs ${botChoice}`);

        m.edit({embeds:[embed]});

        function getResult(me, clientChosen) {
            if ((me === "🗻" && clientChosen === "✂") ||
                (me === "📰" && clientChosen === "🗻") ||
                (me === "✂" && clientChosen === "📰")) {
                    return "You won!";
            } else if (me === clientChosen) {
                return "It's a tie!";
            } else {
                return "You lost!";
            }
        }
    }
}