const https = require('https');

const KEY = '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';
const DB_ID = '2eb60cbd80db80b0ae41d3eb9f774f26';

console.log('--- TEST NOTION KEY ---');
console.log('Testing Key:', KEY);

const options = {
    hostname: 'api.notion.com',
    path: '/v1/users/me',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${KEY}`,
        'Notion-Version': '2022-06-28',
    }
};

const req = https.request(options, (res) => {
    console.log('Status Code:', res.statusCode);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (res.statusCode === 200) {
                console.log('✅ SUCCESS! Key is valid.');
                console.log('Bot Name:', json.bot ? json.bot.owner.type : 'User');
            } else {
                console.log('❌ ERROR! Key is rejected.');
                console.log('Message:', json.message);
                console.log('Code:', json.code);
            }
        } catch (e) {
            console.log('Error parsing response:', e.message);
            console.log('Raw body:', data);
        }
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e);
});

req.end();
