const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app_v2.js');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to replace the corrupted line safely
const newContent = content.replace(/alert\(".*Error al importar.*message\);/, 'alert("⚠️ ERROR: " + e.message);');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Fixed app_v2.js');
