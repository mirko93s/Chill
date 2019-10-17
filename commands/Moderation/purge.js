module.exports = {
    name: "purge",
    aliases: ["clear"],
    category: "Moderation",
    description: "Get rid of many messages with one command",
    usage: "<2-99>",
    run: async (client, msg, arg) => {
        const deleteCount = parseInt(arg[0], 10);
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply("Sorry, you don't have permission to use this!");
        if(!deleteCount || deleteCount < 2 || deleteCount > 99) return msg.reply("Please provide a number between 2 and 99 for the number of messages to delete");
        const fetched = await msg.channel.fetchMessages({limit: deleteCount + 1});
        msg.channel.bulkDelete(fetched)
            .catch(error => msg.reply(`Couldn't delete messages because of: ${error}`));
        setTimeout(function(){
            msg.channel.send(":recycle: Cleared " + deleteCount + " messages.")
            .then(msg => {msg.delete(5000)})
            }, 1000);
    }
}
