/* ============================================
   SMART CITY AI CITIZEN DASHBOARD — script.js
   ============================================ */

// ============================================
// GLOBAL STATE (CRITICAL — DO NOT RENAME)
// ============================================
let weatherData;
let rates;
let citizen;
let factData;

// HF_TOKEN is loaded from config.js (XOR-encrypted, decoded at runtime)
// Do NOT hardcode the token here — run: node generate-config.js

// ============================================
// API ENDPOINTS
// ============================================
const API = {
  weather: 'https://api.weatherapi.com/v1/current.json?key=114bf0aa682e43ae94292609260404&q=Pune',
  currency: 'https://open.er-api.com/v6/latest/USD',
  citizen: 'https://randomuser.me/api/',
  fact: 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en',
  llm: 'https://router.huggingface.co/v1/chat/completions',
};



// ============================================
// DOM REFERENCES
// ============================================
const $ = (id) => document.getElementById(id);

const weatherBody = $('weatherBody');
const currencyBody = $('currencyBody');
const citizenBody = $('citizenBody');
const factBody = $('factBody');

const chatToggle = $('chatToggle');
const chatWindow = $('chatWindow');
const chatClose = $('chatClose');
const chatMessages = $('chatMessages');
const chatInput = $('chatInput');
const chatSend = $('chatSend');



// ============================================
// SKELETON / LOADING HELPER
// ============================================
function showLoading(el) {
  el.innerHTML = `
    <div class="skeleton lg"></div>
    <div class="skeleton" style="width:75%"></div>
    <div class="skeleton" style="width:60%"></div>
  `;
}

function showError(el, message) {
  el.innerHTML = `<div class="error-msg">⚠️ ${message}</div>`;
}

// ============================================
// 1. FETCH WEATHER
// ============================================
async function fetchWeather() {
  const btn = $('refreshWeather');
  btn.classList.add('loading');
  showLoading(weatherBody);
  try {
    const res = await fetch(API.weather);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const cw = data.current;

    // Update global state
    weatherData = {
      temperature: cw.temp_c,
      windspeed: cw.wind_kph,
      weathercode: cw.condition.text,
    };

    const iconUrl = 'https:' + cw.condition.icon;

    weatherBody.innerHTML = `
      <div class="weather-icon"><img src="${iconUrl}" alt="${cw.condition.text}" style="width:64px;height:64px;" /></div>
      <div class="data-row">
        <span class="data-label">Temperature</span>
        <span class="data-value temp">${cw.temp_c}°C</span>
      </div>
      <div class="data-row">
        <span class="data-label">Wind Speed</span>
        <span class="data-value">${cw.wind_kph} km/h</span>
      </div>
      <div class="data-row">
        <span class="data-label">Condition</span>
        <span class="data-value">${cw.condition.text}</span>
      </div>
    `;
  } catch (err) {
    console.error('Weather fetch error:', err);
    showError(weatherBody, 'Could not load weather data.');
  } finally {
    btn.classList.remove('loading');
  }
}

// ============================================
// 2. FETCH CURRENCY
// ============================================
async function fetchCurrency() {
  const btn = $('refreshCurrency');
  btn.classList.add('loading');
  showLoading(currencyBody);
  try {
    const res = await fetch(API.currency);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Update global state — store INR, EUR, GBP relative to USD base
    rates = {
      USD: data.rates.USD,
      INR: data.rates.INR,
      EUR: data.rates.EUR,
      GBP: data.rates.GBP,
    };

    currencyBody.innerHTML = `
      <div class="data-row">
        <span class="data-label">1 USD → INR</span>
        <span class="data-value">${rates.INR.toFixed(2)} ₹</span>
      </div>
      <div class="data-row">
        <span class="data-label">1 USD → EUR</span>
        <span class="data-value">${rates.EUR.toFixed(4)} €</span>
      </div>
      <div class="data-row">
        <span class="data-label">1 USD → GBP</span>
        <span class="data-value">${rates.GBP.toFixed(4)} £</span>
      </div>
    `;
  } catch (err) {
    console.error('Currency fetch error:', err);
    showError(currencyBody, 'Could not load exchange rates.');
  } finally {
    btn.classList.remove('loading');
  }
}

// ============================================
// 3. FETCH CITIZEN
// ============================================
async function fetchCitizen() {
  const btn = $('refreshCitizen');
  btn.classList.add('loading');
  showLoading(citizenBody);
  try {
    const res = await fetch(API.citizen);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const user = data.results[0];

    // Update global state
    citizen = {
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      city: user.location.city,
      image: user.picture.large,
    };

    citizenBody.innerHTML = `
      <div class="citizen-profile">
        <img src="${citizen.image}" alt="Citizen photo of ${citizen.name}" />
        <div class="citizen-name">${citizen.name}</div>
        <div class="citizen-detail">📍 ${citizen.city}</div>
        <div class="citizen-detail">📧 ${citizen.email}</div>
      </div>
    `;
  } catch (err) {
    console.error('Citizen fetch error:', err);
    showError(citizenBody, 'Could not load citizen profile.');
  } finally {
    btn.classList.remove('loading');
  }
}

// ============================================
// 4. FETCH FACT
// ============================================
async function fetchFact() {
  const btn = $('refreshFact');
  btn.classList.add('loading');
  showLoading(factBody);
  try {
    const res = await fetch(API.fact);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Update global state
    factData = {
      text: data.text,
    };

    factBody.innerHTML = `
      <div class="fact-text">${factData.text}</div>
    `;
  } catch (err) {
    console.error('Fact fetch error:', err);
    showError(factBody, 'Could not load city fact.');
  } finally {
    btn.classList.remove('loading');
  }
}

// ============================================
// REFRESH BUTTONS
// ============================================
$('refreshWeather').addEventListener('click', fetchWeather);
$('refreshCurrency').addEventListener('click', fetchCurrency);
$('refreshCitizen').addEventListener('click', fetchCitizen);
$('refreshFact').addEventListener('click', fetchFact);

// ============================================
// CHATBOT UI TOGGLE
// ============================================
chatToggle.addEventListener('click', () => {
  chatWindow.classList.toggle('open');
});

chatClose.addEventListener('click', () => {
  chatWindow.classList.remove('open');
});



// ============================================
// CHATBOT LOGIC — CONTEXT-GROUNDED AI
// ============================================

function buildLiveContext() {
  const tempVal = weatherData ? weatherData.temperature : 'N/A';
  const windVal = weatherData ? weatherData.windspeed : 'N/A';
  const rateUSD = rates ? rates.USD : 'N/A';
  const rateEUR = rates ? rates.EUR : 'N/A';
  const rateGBP = rates ? rates.GBP : 'N/A';
  const citizenName = citizen ? citizen.name : 'N/A';
  const citizenCity = citizen ? citizen.city : 'N/A';
  const citizenEmail = citizen ? citizen.email : 'N/A';
  const factText = factData ? factData.text : 'N/A';

  const liveContext = `
You are a helpful SmartCity assistant.
Answer only based on the following live data from the dashboard:

WEATHER: Temperature is ${tempVal}°C,
         Wind speed is ${windVal} km/h

CURRENCY: 1 INR = ${rateUSD} USD,
          1 INR = ${rateEUR} EUR,
          1 INR = ${rateGBP} GBP

CITIZEN ON SCREEN: ${citizenName},
                   from ${citizenCity},
                   email: ${citizenEmail}

CITY FACT: ${factText}

If the user asks something not related to this data,
politely say you only know about the dashboard data.
`;

  return liveContext;
}

function appendMessage(text, role) {
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;

  const label = document.createElement('div');
  label.className = 'msg-label';
  label.textContent = role === 'user' ? 'You' : 'Assistant';

  const body = document.createElement('span');
  body.textContent = text;

  div.appendChild(label);
  div.appendChild(body);

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendErrorMessage(text) {
  const div = document.createElement('div');
  div.className = 'chat-msg bot error';

  const label = document.createElement('div');
  label.className = 'msg-label';
  label.textContent = 'Error';

  const body = document.createElement('span');
  body.textContent = text;

  div.appendChild(label);
  div.appendChild(body);

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

let _thinkingTimers = [];

function showTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'typing-indicator';
  div.id = 'typingIndicator';
  div.innerHTML = '<span></span><span></span><span></span><div class="thinking-status" id="thinkingStatus"></div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // After 3s, show "thinking" status text
  _thinkingTimers.push(setTimeout(() => {
    const status = $('thinkingStatus');
    if (status) {
      status.textContent = '🧠 Thinking hard...';
      status.classList.add('visible');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 3000));

  // After 8s, update to "almost there"
  _thinkingTimers.push(setTimeout(() => {
    const status = $('thinkingStatus');
    if (status) {
      status.textContent = '⏳ Almost there...';
    }
  }, 8000));

  // After 15s, reassure user
  _thinkingTimers.push(setTimeout(() => {
    const status = $('thinkingStatus');
    if (status) {
      status.textContent = '🔄 Still working on it, hang tight!';
    }
  }, 15000));
}

function removeTypingIndicator() {
  // Clear all pending timers
  _thinkingTimers.forEach(t => clearTimeout(t));
  _thinkingTimers = [];
  const el = $('typingIndicator');
  if (el) el.remove();
}

async function sendMessage() {
  const userQuestion = chatInput.value.trim();
  if (!userQuestion) return;

  // Check if token is available from config.js
  if (typeof HF_TOKEN === 'undefined' || !HF_TOKEN) {
    appendErrorMessage('AI token not configured. Run: node generate-config.js');
    return;
  }

  // Append user message
  appendMessage(userQuestion, 'user');
  chatInput.value = '';
  chatSend.disabled = true;

  // Show typing indicator
  showTypingIndicator();

  try {
    const liveContext = buildLiveContext();

    const response = await fetch(API.llm, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-Instruct-v0.2:featherless-ai',
        messages: [
          { role: 'system', content: liveContext },
          { role: 'user', content: userQuestion },
        ],
        max_tokens: 512,
        temperature: 0.5,
      }),
    });

    removeTypingIndicator();

    if (!response.ok) {
      const errBody = await response.text();
      console.error('LLM API error:', response.status, errBody);
      throw new Error(`API returned ${response.status}`);
    }

    const result = await response.json();

    // Extract response from the chat completion format
    let botReply = '';
    if (result.choices && result.choices.length > 0) {
      botReply = result.choices[0].message?.content || result.choices[0].text || '';
    } else if (result.generated_text) {
      botReply = result.generated_text;
    } else if (Array.isArray(result) && result[0]?.generated_text) {
      botReply = result[0].generated_text;
    }

    botReply = botReply.trim();
    if (!botReply) {
      botReply = 'Sorry, I could not generate a response. Please try again.';
    }

    appendMessage(botReply, 'bot');
  } catch (err) {
    removeTypingIndicator();
    console.error('Chat error:', err);
    appendErrorMessage('Oops! Could not reach the AI. Please check your token or try again.');
  } finally {
    chatSend.disabled = false;
    chatInput.focus();
  }
}

// Chat event listeners
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// ============================================
// INITIALIZE EVERYTHING ON LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  fetchWeather();
  fetchCurrency();
  fetchCitizen();
  fetchFact();
});
