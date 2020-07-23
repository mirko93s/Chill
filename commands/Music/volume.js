

module.exports = {
    name: "volume",
    category: "Music",
    description: "Set music volume (default: 5)",
    permission: "ADMINISTRATOR",
    usage: "volume [value]\n**e.g.**\n\`volume\`\n> Get current volume value\n\`volume 10\`\n> Set volume to 10\n> Default value is 5, it is not reccomended to set too high values to avoid audio distortion\n> Values are logarithmic, so a small value increase will provide a big volume boost",
    run: async (client, msg, arg) => {

    }
}
