/* Auto-generated — DO NOT COMMIT THIS FILE */
/* Run: node generate-config.js to regenerate */

const _EK = 'SmartCityAIDashboard2026';
const _ET = 'Ows+AAYvECAPDAAPORcwMSEbCwl1QF1DBxcpGyQOPRMSAgUmCQ==';

function _dk(encoded, key) {
  const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i] ^ key.charCodeAt(i % key.length));
  }
  return result;
}

window.HF_TOKEN = _dk(_ET, _EK);
