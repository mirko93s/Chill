const { readdirSync } = require("fs");

const ascii = require("ascii-table");

let table = new ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = (client) => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
    
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                continue;
            }
    
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
    
    console.log(table.toString());
    console.log(`\n`);
    setTimeout(() => {console.log(` ▄▄▄▄▄▄▄▄▄▄▄  ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄            ▄                                        `);}, 100);
    setTimeout(() => {console.log(`▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌          ▐░▌                                       `);}, 200);
    setTimeout(() => {console.log(`▐░█▀▀▀▀▀▀▀▀▀ ▐░▌       ▐░▌ ▀▀▀▀█░█▀▀▀▀ ▐░▌          ▐░▌                                       `);}, 300);
    setTimeout(() => {console.log(`▐░▌          ▐░▌       ▐░▌     ▐░▌     ▐░▌          ▐░▌                                       `);}, 400);
    setTimeout(() => {console.log(`▐░▌          ▐░█▄▄▄▄▄▄▄█░▌     ▐░▌     ▐░▌          ▐░▌                                       `);}, 500);
    setTimeout(() => {console.log(`▐░▌          ▐░░░░░░░░░░░▌     ▐░▌     ▐░▌          ▐░▌                    ██████╗    ██╗  ██╗`);}, 600);
    setTimeout(() => {console.log(`▐░▌          ▐░█▀▀▀▀▀▀▀█░▌     ▐░▌     ▐░▌          ▐░▌                   ██╔════╝    ██║  ██║`);}, 700);
    setTimeout(() => {console.log(`▐░▌          ▐░▌       ▐░▌     ▐░▌     ▐░▌          ▐░▌                   ███████╗    ███████║`);}, 800);
    setTimeout(() => {console.log(`▐░█▄▄▄▄▄▄▄▄▄ ▐░▌       ▐░▌ ▄▄▄▄█░█▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄          ██╔═══██╗   ╚════██║`);}, 900);
    setTimeout(() => {console.log(`▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌         ╚██████╔╝██╗     ██║`);}, 1000);
    setTimeout(() => {console.log(` ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀           ╚═════╝ ╚═╝     ╚═╝`);}, 1100);
    setTimeout(() => {console.log(`┬─┐┌─┐┌─┐┌┬┐┬ ┬`);}, 1200);
    setTimeout(() => {console.log(`├┬┘├┤ ├─┤ ││└┬┘`);}, 1300);
    setTimeout(() => {console.log(`┴└─└─┘┴ ┴─┴┘ ┴ `);}, 1400);
    console.log(`\n`);
}