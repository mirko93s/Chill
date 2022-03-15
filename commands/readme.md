# THERE ARE NO COMMANDS HERE!

## They all are slash commands and they can be found in the [`./slashs`](https://github.com/mirko93s/Chill/tree/master/slashs) folder

#### ⚠️⚠️⚠️ Keep in mind that the Bot still supports old "chat commands" (the ones used prior to slash commands, with custom prefixes) and it will load them from this folder or its subfolders. So if you still want to use those you can create them using the template below and placing the .js file here.

##### *This method is deprecated and won't receive any update.*
<details>
  <summary>chat command template</summary> 
  
  ```js
const Discord = require("discord.js");
  
module.exports = {
    name: "_",
    aliases: ["_", "_"],
    description: "_",
    run: async (client, msg, arg) => {
        
    }
}
```
  
</details>
