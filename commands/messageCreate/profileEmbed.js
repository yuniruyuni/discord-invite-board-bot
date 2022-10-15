const Discord = require('discord.js');
const prefix = require('../../configJsons/config.json').prefix;
const fs = require('fs');
const { setTimeout } = require('timers/promises');
const URL = require("url").URL;


const name = 'messageCreate';

const handler = async message => {
    if(message.author.bot) return;

    if(message.content.startsWith(`${prefix}pf`)){
        let embedTemplate;
        let jsonData;
        let [option, text] = splitOptionText(message.content);

        //ファイルロード
        if(fs.existsSync(`./profilesData/${message.author.id}.json`)){
            const embeds = fs.readFileSync(`./profilesData/${message.author.id}.json`);
            jsonData = await JSON.parse(embeds, 'utf8');

            embedTemplate = await new Discord.MessageEmbed()
                .setAuthor({
                    name: `${message.member.displayName}`,  //displayNameだとnicknameも考慮してくれる
                    iconURL: message.author.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png',
                })
                .setThumbnail(message.author.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png')
                .setTimestamp()
                .setTitle(jsonData['embeds'][0]['title'])
                .setColor(jsonData['embeds'][0]['color'])
                .setDescription(jsonData['embeds'][0]['description'])
                .setImage(jsonData['embeds'][0]['image']['url'])
            
            console.log('1')
        }else{
            message.channel.send("プロフィールを作成しました。");
            embedTemplate = await new Discord.MessageEmbed()
                .setAuthor({
                    name: `${message.member.displayName}`,  //displayNameだとnicknameも考慮してくれる
                    iconURL: message.author.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png',
                })
                .setTitle("")
                .setDescription("")
                .setImage("")
                .setThumbnail(message.author.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png')
                .setTimestamp()
            console.log('2')

        }

        if(/^display$/i.test(option) && jsonData != null){
            message.channel.send(jsonData);
            return;
        }

        switch(true){
            case /^help$/i.test(option):
                message.channel.send(
                    "コマンド例 !pf title hogehoge" + "\n" +
                    "オプション:" + "\n" + 
                    "color : 色コードを入力してください" + "\n" +
                    "title : 文字を入力してください" + "\n" + 
                    "description : 文字を入力してください" + "\n" +
                    "image : URLを入力してください" + "\n" +
                    "display : プロフィールが表示されます"
                    );
                break;
            
            
            case /^color$/i.test(option):       //colorチェックしないとだめ
                if(text.match(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)){   //#は使わない
                    embedTemplate.setColor(text)        //#0099f 0x0099ff
                }else{
                    message.channel.send('値が間違っています\n 例: 0099ff または AAA');
                }
                break;
            
            case /^title$/i.test(option):
                embedTemplate.setTitle(text)
                break;
            
            case /^description$/i.test(option):
                embedTemplate.setDescription(text)
                break;
            
            case /^image$/i.test(option):
                if(imageCheck(text)){
                    embedTemplate.setImage(text)
                }else{
                    message.channel.send('正しいurlを入力してください');
                }
                break;
            
            case /^display$/i.test(option):
                break

            default:
                message.channel.send(`${option}オプションは存在しません。\nオプション例: color, title, description, image`);
                break;
            
        }

        //保存するオブジェクト
        let profileObject = {
            embeds: [embedTemplate],
        }

        fs.writeFile(`./profilesData/${message.author.id}.json`, JSON.stringify(profileObject, null, '    '), (err, file) => {
            if(err){
                console.log(err);
            }else{
                console.log('OK')
            }
        });

        //表示して削除
        const reply = await message.channel.send({ embeds: [embedTemplate] });
        await setTimeout(5000);
        await message.delete();
        await reply.delete();
    }

    function imageCheck(url){
        try{
            new URL(url);
            return true;
        }catch (err){
            return false;
        }
    }

    
    function splitOptionText(messageContent){
        let arrayText = messageContent.split(' ').slice(1);
        let text = arrayText.slice(1).join(' ');    //説明文
        return [arrayText[0], text];
    }
}

module.exports = {name, handler};
