const Discord = require('discord.js');
const weather = require('weather-js');

module.exports = {
    name: "weather",
    description: "Check the weather",
    options: [
        {
            name: "city",
            description: "City to get weather of",
            type: 'STRING',
            required: true,
        },
    ],
    run: async (client, interaction, arg) => {

        const nolocationEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ There was an error trying to find your location. Please try again.`)
        const windDirection = {'North':'N', 'South':'S', 'West':'W', 'East':'E', 'Northwest':'NW', 'Northeast':'NE', 'Southwest':'SW', 'Southeast':'SE',}
        weather.find({
            search: arg.join(" "),
            degreeType: 'C'
          }, function(err, result) {
            if (result === undefined || result.length === 0 || err) return interaction.reply({ephemeral:true, embeds:[nolocationEmbed]});
            var current = result[0].current;
            const embed = new Discord.MessageEmbed()
                .setDescription(`**${current.skytext.toUpperCase()}**`)
                .setAuthor({name: `Weather`})
                .setTitle(`${current.observationpoint} <t:${Date.parse(`${current.date} ${current.observationtime}`)/1e3}:D>`)
                .setThumbnail(current.imageUrl)
                .setColor(0x00AE86)
                .addField('🌡️Temperature', `${current.temperature} °C | ${Math.round(current.temperature*1.8)+32} °F`, true)
                .addField('♨️Feels like', `${current.feelslike} °C | ${Math.round(current.feelslike*1.8)+32} °F`, true)
                .addField(`📉Low: ${result[0].forecast[1].low} °C | ${Math.round(result[0].forecast[1].low*1.8)+32} °F`, `📈High: ${result[0].forecast[1].high} °C | ${Math.round(result[0].forecast[1].high*1.8)+32} °F`, true)
                .addField('🌬️Wind', `${windDirection[current.winddisplay.split(' ')[2]]} ${current.windspeed} | ${(current.windspeed.replace(/\D/g, '')/1.609).toFixed()} mp/h`, true)
                .addField('💧Humidity', `${current.humidity}%`, true)
                .addField('☔Precipitations', `${result[0].forecast[1].precip}%`, true)

            for (let i = 2; i < 5; i++) {
                const f = result[0].forecast[i];
                embed.addField(`<t:${Date.parse(f.date)/1e3}:D>`, `**${f.skytextday}**\nLow: ${f.low} °C | ${Math.round(f.low*1.8)+32} °F\nHigh: ${f.high} °C | ${Math.round(f.high*1.8)+32} °F\nPrecipitations: ${f.precip.length > 0 ? f.precip : '0'}%`, true)
            }
            return interaction.reply({embeds:[embed]});
          })
    }
}