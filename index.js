const Discord = require('discord.js');
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
});


//必須
require('dotenv').config();     //.envでtokenとか管理
const config = require('./configJsons/config.json');
const prefix = config.prefix;   //コマンドの頭文字


//読み込み部分
const messageCreate_events = require('./commands/messageCreate/messageCreate_events.js');                            //イベントファイル
messageCreate_events.forEach(({name, handler}) => client.on(name, handler));            //commands_eventsファイルからコマンドを読み込む
const messageReactionAdd_events = require('./commands/messageReactionAdd/messageReactionAdd_events.js');        //イベントファイル
messageReactionAdd_events.forEach(({name, handler}) => client.on(name, handler));       //messageReactionAdd_eventsファイルからコマンドを読み込む
const messageReactionRemove_events = require('./commands/messageReactionRemove/messageReactionRemove_events.js');        //イベントファイル
messageReactionRemove_events.forEach(({name, handler}) => client.on(name, handler));       //messageReactionRemove_eventsファイルからコマンドを読み込む


client.on('ready', () => {
    //client.channels.cache.get(config.logchannel).send('起動したよ');
    console.log(`Logged in as ${client.user.tag}!`);
});



client.login(process.env.DISCORD_TOKEN);