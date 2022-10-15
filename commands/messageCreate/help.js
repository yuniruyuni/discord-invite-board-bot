//help.js

const emoji = require('node-emoji');
const prefix = require('../../configJsons/config.json').prefix;

const name = 'messageCreate';

const handler = async message => {
    if(message.content === `${prefix}help`){
        
        message.channel.send(
            "コマンド説明" + "\n" +
            "!ゲーム名@人数 コメント     例:!Minecraft@3 hogehoge" + "\n" +
            "上記のコマンドを入力すると募集画面が作成され、" + emoji.get('o') + "を押すことで参加者に追加されます。" + "\n" +
            "また、募集を切りたい場合は" + emoji.get('x') + "のリアクションをつけることで募集を閉め切れます。" + "\n" +
            "表示される画像などは configJsons -> gametitle.json に書き込むことでゲーム名を入力した際の画像が設定できます。" + "\n\n" +
            "!pf オプション 文字        例:!pf title hogehoge" + "\n" +
            "独自のプロフィールを作成できます。 その他オプションについては !pf help を参照ください。" + "\n\n" +
            "!shutdown" + "\n" + "botを落とせます。"
        );
    }
};

module.exports = {name, handler};