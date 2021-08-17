const Discord = require("discord.js");

module.exports = {
    name: "connect4",
    aliases: ["c4"],
    category: "Fun",
    description: "Play the classic Connect 4 game with a friend",
    usage: "connect4\n**e.g.**\n\`connect4\`\n> Start a game of Connect 4 and react to place chips\n> The game will automatically stop after 60 seconds of inactivity",
    run: async (client, msg, arg) => {

        var boardarray = [
            [`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`],
            [`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`],
            [`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`],
            [`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`],
            [`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`],
            [`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`,`⚪`]
        ]
        var turn = `🔴`;
        const boardEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(`CONNECT 4`)
            .setTitle(`🔴 Turn`)
            .setDescription(boardToString(boardarray))
            .addField(`1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣`,`*React to place a chip*`)
        msg.channel.send({embeds:[boardEmbed]}).then(sent => {
            // add reactions
            const reactions = [`1️⃣`,`2️⃣`,`3️⃣`,`4️⃣`,`5️⃣`,`6️⃣`,`7️⃣`];
            for (const reaction of reactions) sent.react(reaction);
            //create reaction collector and its filter
            const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && !user.bot;
            const collector = sent.createReactionCollector({filter, time: 60*1000});
            collector.on('collect', clicked => {
                clicked.users.remove(clicked.users.cache.filter(u => u.id !== client.user.id).first()); //remove reaction          
                if (reactions.includes(clicked.emoji.name)) collector.resetTimer({ time: 60*1000 }); //if a valid emoji then reset collector timer
                var x = 0;
                var y = 0;
                //set column
                const emojiToNum = {'1️⃣':0,'2️⃣':1,'3️⃣':2,'4️⃣':3,'5️⃣':4,'6️⃣':5,'7️⃣':6};
                x = emojiToNum[clicked.emoji.name];
                //find an empty chip in that column
                for (var y=5; y>=0; y--) {
                    if (boardarray[y][x] == "⚪") {
                        boardarray[y][x] = turn;
                        boardEmbed.setDescription(boardToString(boardarray));
                        break;
                    }
                    else if (y==0 && boardarray[y][x] != "⚪") return/*column full message*/;
                }
                // //check if player won
                if (haswon(turn, boardarray, x, y) == true) {
                    collector.stop("hasWon");
                    boardEmbed.setTitle(`${turn} WON ! ! !`)
                    return sent.edit({embeds:[boardEmbed]});
                }
                else if (checkDraw(boardarray) == true) {
                    collector.stop("draw");
                    boardEmbed.setTitle(`DRAW!`)
                    return sent.edit({embeds:[boardEmbed]});
                }
                turn == "🔴" ? turn = "🟡" : turn = "🔴"; //change turn
                boardEmbed.setTitle(`${turn} Turn`);
                return sent.edit({embeds:[boardEmbed]});
            });
            collector.on('end', (collection, reason) => {
                if (reason == "time") {
                    boardEmbed.setTitle(`Game stopped due to inactivity`);
                    return sent.edit({embeds:[boardEmbed]});
                }
            });
        })
    }
}
function boardToString (board) { //convert board array to string
    var string = "";
    for (var i = 0; i<board.length;i++) {
        string += `${board[i].join(" ")}`;
        if (i != board.length) string += "\n";
    }
    return string;
}

function checkDraw (boardarray) {
    if (boardarray[0][0] != "⚪" && boardarray[0][1] != "⚪" && boardarray[0][2] != "⚪" && boardarray[0][3] != "⚪" && boardarray[0][4] != "⚪" && boardarray[0][5] != "⚪" && boardarray[0][6] != "⚪") return true;
    else return false;
}

function haswon (thisturn, boardarray, x, y) {
    //horizontal
    for (var i = 0; i<4; i++) {
        if (boardarray[y][i] == thisturn && boardarray[y][i+1] == thisturn && boardarray[y][i+2] == thisturn && boardarray[y][i+3] == thisturn) return true;
    }
    //vertical
    for (var i = 0; i<3; i++) {
        if (boardarray[i][x] == thisturn && boardarray[i+1][x] == thisturn && boardarray[i+2][x] == thisturn && boardarray[i+3][x] == thisturn) return true;
    }
    //descending diagonal
    for (var i = 0; i<3; i++) {
        if(x<y) {
            if (x-x+i+3 > 6 || y-x+i+3 > 5) break;
        }
        else if (x-y+i+3 > 6 || y-y+i+3 > 5) break;
        if (boardarray[x<y ? y-x+i : y-y+i][x<y ? x-x+i : x-y+i] == thisturn && boardarray[x<y ? y-x+i+1 : y-y+i+1][x<y ? x-x+i+1 : x-y+i+1] == thisturn && boardarray[x<y ? y-x+i+2 : y-y+i+2][x<y ? x-x+i+2 : x-y+i+2] == thisturn && boardarray[x<y ? y-x+i+3 : y-y+i+3][x<y ? x-x+i+3 : x-y+i+3] == thisturn) return true;
    }
    //ascending diagonal
    for (var i = 0; i<3; i++) {
        if(x>(5-y)) {
            if (x-(5-y)+i+3 > 6 || y+(5-y)-i-3 < 0) break;
        }
        else if (x-x+i+3 > 6 || y+x-i-3 < 0) break;
        if (boardarray[x>(5-y) ? y+(5-y)-i : y+x-i][x>(5-y) ? x-(5-y)+i : x-x+i] == thisturn && boardarray[x>(5-y) ? y+(5-y)-i-1 : y+x-i-1][x>(5-y) ? x-(5-y)+i+1 : x-x+i+1] == thisturn && boardarray[x>(5-y) ? y+(5-y)-i-2 : y+x-i-2][x>(5-y) ? x-(5-y)+i+2 : x-x+i+2] == thisturn && boardarray[x>(5-y) ? y+(5-y)-i-3 : y+x-i-3][x>(5-y) ? x-(5-y)+i+3 : x-x+i+3] == thisturn) return true;
    }
    return false;
}