require('dotenv').config();  // 加载环境变量
const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

// 启用 CORS 允许跨域请求
app.use(cors());
app.use(express.json()); 


app.post('/proxy', (req, res) => {
    console.log('Received POST request on /proxy');  // 调试日志，确认请求到达

    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    
    const options = {
        url: apiUrl,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        json: true,
        body: req.body  // 将请求体转发给 OpenAI API
    };

    request(options, (error, response, body) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('Error processing the request.');
        }
        console.log('Response from OpenAI:', body);  
        res.status(response.statusCode).json(body);  
    });
});

app.listen(3001, () => console.log('Proxy server running on port 3001'));
