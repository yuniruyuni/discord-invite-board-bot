//hi.js
//test用
const emoji = require('node-emoji');
const prefix = require('../../configJsons/config.json').prefix;

const name = 'messageCreate';

const handler = async message => {
    if(message.content === `${prefix}hi`){
        message.channel.send('hello');
        message.react(emoji.get('grey_exclamation'));
    }
};

module.exports = {name, handler};