module.exports = {
    name: "suicide",
    aliases: ["kms", "killme", "respawn"],
    category: "Fun",
    description: "Kill yourself with this command. Now comes with free revival!",
    run: async (client, msg, arg) => {
        msg.delete();
        let user = msg.author.username;
        msg.channel.send(`**${user}** has died.`).then(msg => {
            setTimeout(() => { msg.edit(`**${user}** has died.\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n*Respawning...*`); }, 500);
            setTimeout(() => { msg.edit(`**${user}** has died.\n⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛\n*Respawning...*`); }, 1000);
            setTimeout(() => { msg.edit(`**${user}** has died.\n⬜⬜⬛⬛⬛⬛⬛⬛⬛⬛\n*Respawning...*`); }, 1500);
            setTimeout(() => { msg.edit(`**${user}** has died.\n⬜⬜⬜⬛⬛⬛⬛⬛⬛⬛\n*Respawning...*`); }, 2000);
            setTimeout(() => { msg.edit(`**${user}** has died.\n⬜⬜⬜⬜⬛⬛⬛⬛⬛⬛\n*Respawning...*`); }, 2500);
            setTimeout(() => { msg.edit(`**${user}** has died.\n⬜⬜⬜⬜⬜⬛⬛⬛⬛⬛\n*Respawning...*`); }, 3000);
            setTimeout(() => { msg.edit(`**${user}** has died.\n⬜⬜⬜⬜⬜⬜⬛⬛⬛⬛\n*Respawning...*`); }, 3500);
            setTimeout(() => { msg.edit(`**${user}** has died.\n⬜⬜⬜⬜⬜⬜⬜⬛⬛⬛\n*Respawning...*`); }, 4000);
            setTimeout(() => { msg.edit(`**${user}** has died.\n⬜⬜⬜⬜⬜⬜⬜⬜⬛⬛\n*Respawning...*`); }, 4500);
            setTimeout(() => { msg.edit(`**${user}** has died.\n⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛\n*Respawning...*`); }, 5000);
            setTimeout(() => { msg.edit(`**${user}** has died.\n⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜\n*Respawning...*`); }, 5500);
            setTimeout(() => { msg.edit(`Revival complete. Welcome back, **${user}**`); }, 6000);
        });
    }
}