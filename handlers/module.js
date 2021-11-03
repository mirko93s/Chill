require('fs').readdirSync('./functions/').forEach(file => {
    if (file.endsWith(".js")) {
        exports[file.replace('.js', '')] = require('../functions/' + file);
    }
});