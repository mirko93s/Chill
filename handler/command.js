const { readdirSync } = require("fs");
const _progress = require('cli-progress');

module.exports = (client) => {

    const b1 = new _progress.SingleBar({
        format: '\033[34mLoading Commands \033[0m' + ('\033[36m\033[44m{bar}\033[0m') + '\033[34m {percentage}% | ETA: {eta}s | {value}/{total} Loaded\033[0m',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
        noTTYOutput: true
    });
    b1.start(0, 0);

    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
        b1.setTotal((b1.getTotal())+commands.length);

        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            if (pull.name) {
                client.commands.set(pull.name, pull);
                b1.increment();
            }
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });

    b1.stop();
    if (b1.value < b1.getTotal()) console.log("\033[31mERROR LOADING: " + (b1.getTotal()-b1.value) + " commands (missing module.name)\033[0m");
}