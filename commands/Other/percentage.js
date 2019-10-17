module.exports = {
    name: "percentage",
    aliases: ["%"],
    category: "Other",
    description: "Calculate a percentage",
    usage: "<amount> <maximum>",
    run: async (client, msg, arg) => {
        msg.delete();
        const amount = arg[0]
        const maximum = arg[1]
        const percentage = (amount / maximum) * 100;
        msg.channel.send(`${amount} is ${percentage}% of ${maximum}.`);
    }
}
