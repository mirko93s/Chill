const { readdirSync } = require("fs");
const _progress = require('cli-progress');

module.exports = (client) => {

    const multibar = new _progress.MultiBar({
        format: '\033[36mLoading Commands \033[0m' + ('\033[36m\033[44m{bar}\033[0m') + '\033[36m {percentage}% | ETA: {eta}s | {value}/{total} Loaded\033[0m',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
        noTTYOutput: true
    });
    const b1 = multibar.create(0, 0);
    const b2 = multibar.create(0, 0);    

    let slashs = [];
    readdirSync("./slashs/").forEach(dir => {
        const commands = readdirSync(`./slashs/${dir}/`).filter(file => file.endsWith(".js"));
        b1.setTotal((b1.getTotal())+commands.length);
        for (let file of commands) {
            let pull = require(`../slashs/${dir}/${file}`);
            try {
                    client.slashs.set(pull.name, pull);
                    slashs.push(pull);
                    client.cmdstats.ensure('usage', 0, pull.name);
                if (pull.user) { // if command also has user context menu load it
                    client.slashs.set(pull.user.name, pull.user);
                    slashs.push(pull.user);
                    client.cmdstats.ensure('usage', 0, pull.user.name);
                }
                if (pull.message) { // if command also has message context menu load it
                    client.slashs.set(pull.message.name, pull.message);
                    slashs.push(pull.message);
                    client.cmdstats.ensure('usage', 0, pull.message.name);
                }
                b1.increment();
                multibar.update();
            } catch(err) {
                console.error(err)
            }
        }
    });
    client.once("ready", async() => {
        try {
            await client.guilds.cache.get("765365684036304906").commands.set(slashs);
            await client.guilds.cache.get("878276639455338570").commands.set(slashs);
        } catch(err) {
            console.error(err)
        }
    })

    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
        b2.setTotal((b2.getTotal())+commands.length);
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            if (pull.name) {
                client.commands.set(pull.name, pull);
                client.cmdstats.ensure('usage', 0, pull.name);
                b2.increment();
                multibar.update();
            }
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });

    multibar.stop();
    if (b1.value < b1.getTotal()) console.log("\033[31mERROR LOADING: " + (b1.getTotal()-b1.value) + " slash commands (missing module.name)\033[0m");
    if (b2.value < b2.getTotal()) console.log("\033[31mERROR LOADING: " + (b2.getTotal()-b2.value) + " message commands (missing module.name)\033[0m");
}