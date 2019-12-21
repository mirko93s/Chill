module.exports = {
    name: "project",
    aliases: ["github"],
    category: "Bot",
    description: "Return link to Github Bot project",
    run: async (client, msg, arg) => {
        msg.delete();
        msg.channel.send("paste-github-link-here")
    }
}
