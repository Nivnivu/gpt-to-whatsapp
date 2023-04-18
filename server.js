const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const PORT = process.env.PORT || 4000
const express = require('express')
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);


const app = express();

const client = new Client({
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
    
});
const GetResponseFromGpt = async (prompt) => {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 100
      });
      console.log(completion.data.choices[0].text);
      const data = completion.data.choices[0].text
      return data
}


client.on('ready', async () => {
    console.log('Client is ready!');
    // Get the chat object for a WhatsApp group
    const groupId = '120363071709256271@g.us';
    const groupChat = await client.getChatById(groupId);
    // Send a message to the group chat
     const message = 'Hello from my WhatsApp bot!';
     groupChat.sendMessage(message);
  });


client.on('message', async (message) => {
	console.log(typeof message.body);
    const response = await GetResponseFromGpt(message.body)
    console.log(response)
    client.sendMessage(message.from, response);
});
 


client.initialize();

  app.listen(PORT, () => {
    console.log('server works on port 5000');
});



// client.on('ready', async () => {
//     console.log('Client is ready!');
  
//     // Get a list of all the chats that the client has access to
//     const chats = await client.getChats();
  
//     // Find the group chat that you want to get the ID for
//     const groupName = 'CryptoPredictions';
//     const groupChat = chats.find((chat) => chat.isGroup && chat.name === groupName);
  
//     if (groupChat) {
//       console.log(`Group ID for ${groupName}: ${groupChat.id._serialized}`);
//     } else {
//       console.log(`Group ${groupName} not found!`);
//     }
//   });
  
 
// 120363071709256271@g.us
 