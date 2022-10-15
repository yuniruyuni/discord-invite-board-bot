const Discord = require('discord.js');
const prefix = require('../../configJsons/config.json').prefix;
const emoji = require('node-emoji');

const fs = require('fs');
const jsonData = JSON.parse(fs.readFileSync("./configJsons/gametitle.json", 'utf8'));   //こいつだけ相対パス

const name = 'messageCreate';
const cmdRegex = new RegExp("^" + prefix + ".*@[1-9]", 'i');


const handler = async message => {
    if(message.author.bot) return;

    if(cmdRegex.test(message.content)){    //+をつけると空白が入ると falseを返す
        let embeds = await embedTemplate(message.content)
        if(embeds != null){
            let sentMessage = message.channel.send(embeds)
                .then(sentMessage => { 
                    sentMessage.react(emoji.get('o'));      //送ったメッセージにリアクションをつける
                });
            
        }else{
            console.log('embeds else:' + message.content)
            message.channel.send(`コマンドを正しく入力してください 例:valo@4 範囲:1~20人`);
        }
    }else{
        console.log('cmdRegex else:' + message.content);
    }
    

    //タイトル名を確認します
    function titleCheck(title){
        if(jsonData[title] != undefined){
            return jsonData[title];
        }else{
            return null;
        }
    }

    async function embedTemplate(messageContent){
        let arrayString = messageContent.split('@');       //空白文字のゲームが判断できない     !league of legends@4 hogehoge
        let gameTitle = arrayString[0].slice(1);        //!を削除

        let numText = arrayString[1].split(/ |　/);     //数字 と 説明取り出し
        let num = numText[0];
        let commentString = numText.slice(1).join(" ");     //ここは強制的に全角スペースとかを半角スペースに変える
        
        
        
        //画像urlの貼り付け
        let imageURL = await titleCheck(gameTitle);
        console.log(imageURL);

        //numの確認 人数オーバーはエラー出す
        if(!isNaN(num) && 1 <= num && num <= 20){
            num = Number(num);
        }else{
            num = 0;
            console.log(`r1:${gameTitle}\nr2:${num}\nr3:${commentString}`);
            return null;
        }

        //check test
        console.log(`r1:${arrayString[0]}\nr2:${arrayString[1]}\nr3:${commentString}`);

        //送信するembed
        const template = new Discord.MessageEmbed()
            .setColor(0x0099ff)
            .setTitle(gameTitle + '@' + num)
            .setAuthor({
                name: `${message.member.displayName}`,  //displayNameだとnicknameも考慮してくれる
                iconURL: message.author.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png',
            })
            .setDescription(commentString)
            .setThumbnail(message.author.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png')
            .setImage(imageURL)
            .setTimestamp()

        return ({ embeds: [template] });

    };

};

module.exports = {name, handler};
