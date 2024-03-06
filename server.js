'use strict';

const express = require('express');
const line = require('@line/bot-sdk');

const PORT = process.env.PORT || 3000;

// 作成したBOTのチャンネルシークレットとチャンネルアクセストークン
const config = {
  channelSecret: process.env.LINE_BOT_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_BOT_CHANNEL_ACCESS_TOKEN
};

const app = express();

app.use(express.static(__dirname + '/public'));

// 実際にメッセージを受け付ける
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    // ここの if 文は developer console の「接続確認」用なので削除して問題ないです。
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return; 
    }

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.messagingApi.MessagingApiClient(config);

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text // 実際に返信の言葉を入れる箇所（そのままオウム返し）
  });
}

app.listen(PORT);

console.log(`Server running at ${PORT}`);