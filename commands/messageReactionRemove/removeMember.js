const emoji = require('node-emoji');
const Discord = require('discord.js');

const name = 'messageReactionRemove';

const handler = async (reaction, user) => {
    const message = reaction.message;   //例
    if(user.bot) return;  //botは返す キャッシュされてないと使えない
    if(message.reactions.cache.get(emoji.get('x')) != undefined) return;       //xの絵文字がついていると受付しない
    
    await reaction.fetch();  //embedのメッセージをキャッシュにする
    await reaction.users.fetch();   //reactionのmmeber取得に使う
    const members = reaction.users.cache;

    if (message.embeds[0] && reaction.emoji.name === emoji.get('o')) {
        
        let playerNum = splitTitleNum(message.embeds[0]['title']);
        
        if(reaction.count - 1 > playerNum){
            console.log('上限です') //上限だとリアクション取り消し
            message.reactions.cache.get(emoji.get('o')).users.remove(user);
            return;
        }
        
        //リアクションつけた人を取得
        let membersString = "";
        await members.forEach(function(data){
            if(!data['bot']){               //bot含まない
                //console.log(data['username'] + ':' + data['id']);
                console.log('remove後' + data['username'] + ':' + data['id']);
                membersString += `<@${data['id']}>\n`;
            }
        });

        if(membersString.length === 0){
            membersString = "現在参加者はいません";
        }

        let editEmbed = await message.embeds[0];  //embeds取得
        editEmbed.fields[0] = {
            name: '参加者',
            value: membersString,
        };
        await message.edit({ embeds: [editEmbed] });

    }

    function splitTitleNum(titleString){
        let [title, num] = titleString.split('@');
        return Number(num);
    }

};

module.exports = {name, handler};