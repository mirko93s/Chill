const Discord = require("discord.js");
const snekfetch = require("snekfetch");

module.exports = {
    name: "translator",
    aliases: ["translate"],
    category: "Other",
    description: "Translate something",
    usage: "[codelist or codes] <from> <to> <sentence>",
    run: async (client, msg, arg) => {
        msg.delete();
        var codes = {
            "az": "Azerbaijan","sq": "Albanian","am": "Amharic","en": "English","ar": "Arabic","hy": "Armenian","af": "Afrikaans","eu": "Basque",
            "ba": "Bashkir","be": "Belarusian","bn": "Bengali","my": "Burmese","bg": "Bulgarian","bs": "Bosnian","cy": "Welsh","hu": "Hungarian","vi": "Vietnamese",
            "ht": "Haitian (Creole)","gl": "Galician","nl": "Dutch","mrj": "Hill Mari","el": "Greek","ka": "Georgian","gu": "Gujarati","da": "Danish",
            "he": "Hebrew","yi": "Yiddish","id": "Indonesian","ga": "Irish","it": "Italian","is": "Icelandic","es": "Spanish","kk": "Kazakh",
            "kn": "Kannada","ca": "Catalan","ky": "Kyrgyz","zh": "Chinese","ko": "Korean","xh": "Xhosa","km": "Khmer","lo": "Laotian","la": "Latin",
            "lv": "Latvian","lt": "Lithuanian","lb": "Luxembourgish","mg": "Malagasy","ms": "Malay","ml": "Malayalam","mt": "Maltese","mk": "Macedonian",
            "mi": "Maori","mr": "Marathi","mhr": "Mari","mn": "Mongolian","de": "German","ne": "Nepali","no": "Norwegian","pa": "Punjabi","pap": "Papiamento",
            "fa": "Persian","pl": "Polish","pt": "Portuguese","ro": "Romanian","ru": "Russian","ceb": "Cebuano","sr": "Serbian","si": "Sinhala","sk": "Slovakian",
            "sl": "Slovenian","sw": "Swahili","su": "Sundanese","tg": "Tajik","th": "Thai","tl": "Tagalog","ta": "Tamil","tt": "Tatar","te": "Telugu",
            "tr": "Turkish","udm": "Udmurt","uz": "Uzbek","uk": "Ukranian","ur": "Urdu","fi": "Finnish","fr": "French","hi": "Hindi","hr": "Croatian",
            "cs": "Czech","sv": "Swedish","gd": "Scottish","et": "Estonian","eo": "Esperanto","jv": "Javanese","ja": "Japanese"
        }

        const text = arg.slice(2).join(' ')
        const to = arg[1]
        const from = arg[0]
            if (!arg[0] && !arg[1] && !arg[2]) return msg.channel.send("codelist soon...");
            if (arg[0] === arg[1]) return msg.channel.send ("Specify 2 different languages");
            if (!arg[2]) return msg.channel.send ("type something to translate")
            const { body } = await snekfetch
                .get('https://translate.yandex.net/api/v1.5/tr.json/translate')
                .query({
                    key: "paste_yandeex_api_key_here",
                    text,
                    lang: from ? `${from}-${to}` : to
                });
            const lang = body.lang.split('-');
            const embed = new Discord.RichEmbed()
                .setColor(0x00AE86)
                .addField(`From: ${codes[lang[0]]}`,
                    text)
                .addField(`To: ${codes[lang[1]]}`,
                    body.text[0]);
            msg.channel.send({embed}).catch(console.error);
    }
}
