// script.js
document.getElementById('send-btn').addEventListener('click', sendMessage);

var content =[
    {
      "content": "You are a helpful assistant",
      "role": "system"
    }
  ];
var i = 1;

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // 显示用户消息
    appendMessage('user', userInput);
    content[i]={"content": userInput,"role": "user"};
    i++;

    // 调用DeepSeek API
    fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        mode: 'cors',
        headers: {
            "accept": "application/json",
            "accept-language": "zh-CN,zh;q=0.9",
            "authorization": "Bearer sk-fe968d31076e483a884fdf37b99451a7",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "same-site"
        },
        body: JSON.stringify({
            "messages": /*[
                {
                  "content": "You are a helpful assistant",
                  "role": "system"
                },
                {
                  "content": userInput,
                  "role": "user"
                }
              ]*/content,
              "model": "deepseek-reasoner",
              "frequency_penalty": 0,
              "max_tokens": 2048,
              "presence_penalty": 0,
              "response_format": {
                "type": "text"
              },
              "stop": null,
              "stream": false,
              "stream_options": null,
              "temperature": 1,
              "top_p": 1,
              "tools": null,
              "tool_choice": "none",
              "logprobs": false,
              "top_logprobs": null
        }),
        "referrer": "https://api-docs.deepseek.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "credentials": "include"
    })
    .then(response => response.json())
    .then(data => {
        // 显示DeepSeek的回复
        appendMessage('deepseek', "<think>"+data.choices[0].message.reasoning_content+"</think>\n"+data.choices[0].message.content);
        content[i]={"content": data.choices[0].message.content,"reasoning_content":data.choices[0].message.reasoning_content,"role": "assistant"};
        i++;
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // 清空输入框
    document.getElementById('user-input').value = '';
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) {
        console.error('chat-box element not found!');
        return;
    }

    // 创建消息容器
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', sender);

    // 创建头像
    //const avatar = document.createElement('div');
    //avatar.classList.add('avatar');
    //messageContainer.appendChild(avatar);

    // 创建消息内容
    const content = document.createElement('div');
    content.classList.add('content');
    content.textContent = message;
    messageContainer.appendChild(content);

    // 创建时间戳
    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    timestamp.textContent = " "+new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })+" ";
    messageContainer.appendChild(timestamp);

    // 将消息添加到聊天框
    chatBox.appendChild(messageContainer);

    // 滚动到底部
    chatBox.scrollTop = chatBox.scrollHeight;
}
