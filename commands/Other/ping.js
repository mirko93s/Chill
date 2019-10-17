module.exports = {
    name: "ping",
    aliases: ["latency"],
    category: "fun",
    description: "Returns latency and API ping",
    usage: "ping",
    run: async (client, msg, arg) => {
        msg.delete();
        const m = await msg.channel.send(":signal_strength: Calculating...");
        m.edit(`:signal_strength: ${m.createdTimestamp - msg.createdTimestamp} ms`);
    }
}
