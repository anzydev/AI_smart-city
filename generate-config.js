/**
 * generate-config.js
 * 
 * Reads HF_TOKEN from .env, encrypts it with XOR cipher + base64,
 * and writes config.js with the obfuscated token.
 * 
 * Usage:  node generate-config.js
 * 
 * The generated config.js should NOT be committed to git.
 */

const fs = require('fs');
const path = require('path');

// --- Read token: try .env first, then system environment variable (for Vercel/CI) ---
let token = '';

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/HF_TOKEN\s*=\s*(.+)/);
  if (match && match[1].trim()) {
    token = match[1].trim();
    console.log('📄 Token read from .env file');
  }
}

// Fallback: read from system environment variable (Vercel sets this)
if (!token && process.env.HF_TOKEN) {
  token = process.env.HF_TOKEN.trim();
  console.log('🌐 Token read from environment variable');
}

if (!token) {
  console.error('❌  HF_TOKEN not found! Set it in .env or as an environment variable.');
  process.exit(1);
}

// --- XOR cipher key ---
const XOR_KEY = 'SmartCityAIDashboard2026';

// --- Encrypt: XOR each char with cycling key, then base64 ---
function xorEncrypt(plaintext, key) {
  const result = [];
  for (let i = 0; i < plaintext.length; i++) {
    const charCode = plaintext.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result.push(charCode);
  }
  return Buffer.from(result).toString('base64');
}

const encryptedToken = xorEncrypt(token, XOR_KEY);

// --- Write config.js ---
const configContent = `/* Auto-generated — DO NOT COMMIT THIS FILE */
/* Run: node generate-config.js to regenerate */

const _EK = '${XOR_KEY}';
const _ET = '${encryptedToken}';

function _dk(encoded, key) {
  const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i] ^ key.charCodeAt(i % key.length));
  }
  return result;
}

window.HF_TOKEN = _dk(_ET, _EK);
`;

const configPath = path.join(__dirname, 'config.js');
fs.writeFileSync(configPath, configContent, 'utf-8');

console.log('✅  config.js generated with obfuscated token.');
console.log('   Token length:', token.length, 'chars');
console.log('   Encrypted length:', encryptedToken.length, 'chars');
console.log('');
console.log('⚠️  Make sure config.js is in .gitignore!');
