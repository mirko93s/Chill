const Discord = require("discord.js");

module.exports = {
    name: "slotmachine",
    aliases: ["slot"],
    category: "Fun",
    description: "Waste some money on slots",
    run: async (client, msg, arg) => {
        msg.delete();
        const slots = [':grapes:', ':cherries:', ':lemon:', ':tangerine:'];
        const slotOne = slots[Math.floor(Math.random() * slots.length)];
        const slotTwo = slots[Math.floor(Math.random() * slots.length)];
        const slotThree = slots[Math.floor(Math.random() * slots.length)];
        const slotfour = slots[Math.floor(Math.random() * slots.length)];
        const slotfive = slots[Math.floor(Math.random() * slots.length)];
        const slotsix = slots[Math.floor(Math.random() * slots.length)];
        const slotseven = slots[Math.floor(Math.random() * slots.length)];
        const sloteight = slots[Math.floor(Math.random() * slots.length)];
        const slotnine = slots[Math.floor(Math.random() * slots.length)];
        if (slotOne === slotTwo && slotOne === slotThree || slotfour === slotfive && slotfour === slotsix || slotseven === sloteight && slotseven === slotnine) {
            const won = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .addField(`:slot_machine: **Chill Slot** :slot_machine:`,`${slotfour}|${slotfive}|${slotsix}`)
                .addField(`${slotOne}|${slotTwo}|${slotThree}`, `${slotseven}|${sloteight}|${slotnine}`)
                .setFooter("Wow! **" + msg.author.username + "** won great job!");
            msg.channel.send(won)
        } else {
            const lost = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .addField(`:slot_machine: **Chill Slot** :slot_machine:`,`${slotfour}|${slotfive}|${slotsix}`)
                .addField(`${slotOne}|${slotTwo}|${slotThree}`, `${slotseven}|${sloteight}|${slotnine}`)
                .setFooter("Awww **" + msg.author.username + "** lost that sucks!");
            msg.channel.send(lost)
        }
    }
}
