const prefix = require('../../configJsons/config.json').prefix;

const name = 'messageCreate';       //どの機能を使うか

const handler = async message => {
    if(message.content === `${prefix}shutdown`){
        await message.channel.send(`さようなら皆さん`);
        await console.log('shutdown');
        await process.exit();
    }
};

module.exports = {name, handler};