const talkedRecently = new Set();

module.exports = {
    name: "bugreport",
    aliases: ["bug"],
    category: "Bot",
    description: "Report a bug",
    usage: "<msg>",
    run: async (client, msg, arg) => {
        msg.delete();
        if (talkedRecently.has(msg.author.id)) return msg.channel.send("You already reported a issue recently please wait another 30mins.");
                        let feedback = arg.join(' ');
                            if (feedback.length < 10) return msg.reply('Feedback is to short minimum of 10 characters.').catch(console.error);
                        client.users.get("278380909588381698").send(":bug: BUG: " + feedback + "\nReported by " + msg.author.username);
                            msg.reply("Thanks for reporting a issue/choosing to give feedback it has been sent!").then(msg => {msg.delete(5000)});
                    talkedRecently.add(msg.author.id);
                    setTimeout(() => {
                        talkedRecently.delete(msg.author.id);
                    }, 30 * 60000);
    }
}
