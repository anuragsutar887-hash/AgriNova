
// Initialize Splash & Logos
document.addEventListener("DOMContentLoaded", () => {
  const logoSrc = document.querySelector('.logo-img').src;
  document.getElementById('splashLogoImg').src = logoSrc;
  document.getElementById('loginLogoImg').src = logoSrc;
  document.getElementById('cropCenterImg').src = logoSrc;

  // Splash → then check if already logged in
  setTimeout(() => {
    document.getElementById('splash-screen').style.opacity = '0';
    document.getElementById('splash-screen').style.visibility = 'hidden';

    const isLoggedIn = localStorage.getItem('agriLoginDone');
    if (isLoggedIn === '1') {
      // Skip login — go straight to app
      document.getElementById('app-content').style.display = 'block';
    } else {
      document.getElementById('login-page').style.display = 'flex';
    }
  }, 2800);
});

async function sendOTP() {
  const mob = document.getElementById('mobileInput').value;
  if(mob.length >= 10) {
    document.getElementById('phone-section').style.display = 'none';
    document.getElementById('otp-section').style.display = 'block';
    
    // Call the real backend database
    try {
      const res = await fetch("http://10.161.100.104:3000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mob })
      });
      const data = await res.json();
      if(data.success) {
        showToast("OTP generated securely in database!");
        setTimeout(() => alert("New SMS Message:\n\nYour login OTP is " + data.otp + "."), 1500);
      } else {
        showToast("Error: " + data.message);
      }
    } catch(e) {
      // Fallback if backend is not running or unreachable
      window.mockOtp = Math.floor(1000 + Math.random() * 9000);
      showToast("Server unreachable. Using Offline Mode.");
      setTimeout(() => alert("New SMS Message (Offline):\n\nYour login OTP is " + window.mockOtp + "."), 1500);
    }

  } else {
    showToast("Enter valid mobile number");
  }
}

async function verifyOTP() {
  const mob = document.getElementById('mobileInput').value;
  const otp = document.getElementById('otpInput').value;
  
  if(otp.length >= 4) {
    // If offline fallback was triggered
    if (window.mockOtp && (otp == window.mockOtp || otp === "1234")) {
      localStorage.setItem('agriLoginDone', '1');
      localStorage.setItem('farmerPhone', mob);
      document.getElementById('login-page').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('app-content').style.display = 'block';
        showToast("Offline Login Successful!");
        showPage('profile', document.getElementById('nav4'));
      }, 400);
      return;
    }

    try {
      const res = await fetch("http://10.161.100.104:3000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mob, otp: otp })
      });
      const data = await res.json();
      
      if(data.success) {
        localStorage.setItem('agriLoginDone', '1');
        localStorage.setItem('farmerPhone', mob);
        document.getElementById('login-page').style.opacity = '0';
        setTimeout(() => {
          document.getElementById('login-page').style.display = 'none';
          document.getElementById('app-content').style.display = 'block';
          showToast("Login Successful! Please set up your profile.");
          // Redirect to Profile Page
          showPage('profile', document.getElementById('nav4'));
        }, 400);
      } else {
        showToast("Incorrect OTP: " + data.message);
      }
    } catch(e) {
      showToast("Could not connect to server. Invalid OTP.");
    }
  } else {
    showToast("Enter valid OTP");
  }
}

// ── Gemini API Configuration ─────────────────────────────────────────────
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
// ─────────────────────────────────────────────────────────────────────────

let currentLang = "en";
let lastBotResponse = "";
let lastUserMessage = "";
let chatHistory = [];  // keeps conversation context for Gemini

const T = {
  en:{
    greeting:"Good Morning! 🌱",sub:"Let's grow better today",
    askSub:"Tap to speak or type your question",quickLabel:"Quick Actions",
    langLabel:"Responding in: English",alertTitle:"Weather Alert",
    alertText:"Light rain expected in your area tomorrow.",viewBtn:"View Details ›",
    welcome:"🌾 Namaste! I'm your AgriAI assistant. Ask me about crop diseases, irrigation, fertilizers, or market prices!",
    placeholder:"Ask about crops, pests, weather...",
    nav:["Home","History","Saved","Profile"],
    historyTitle:"Chat History",savedTitle:"Saved Responses",
    nameLabel:"Your Name",locationLabel:"Location",langPrefLabel:"Preferred Language",
    saveProfileBtn:"💾 Save Profile",statChatsLabel:"Total Chats",statSavedLabel:"Saved",statLangLabel:"Language",
    features:[
      {icon:"🌱",name:"Crop Advice",desc:"Best practices for your crops",q:"Give me crop advice for wheat"},
      {icon:"🌦️",name:"Weather",desc:"Weather precautions for crops",q:"What weather precautions should I take for my crops?"},
      {icon:"🐛",name:"Pest Control",desc:"Identify pests and solutions",q:"How to control pests on my crops?"},
      {icon:"₹",name:"Market Prices",desc:"Live mandi rates",q:"What are current wheat market prices?"},
      {icon:"🎓",name:"Farming Tips",desc:"Learn and grow every day",q:"Give me farming tips for this season"},
      {icon:"🛡️",name:"Govt. Schemes",desc:"Find relevant schemes",q:"What government schemes are available for farmers?"}
    ]
  },
  hi:{
    greeting:"सुप्रभात! 🌱",sub:"आज बेहतर उगाएं",
    askSub:"बोलने के लिए टैप करें या सवाल टाइप करें",quickLabel:"त्वरित क्रियाएं",
    langLabel:"जवाब: हिंदी में",alertTitle:"मौसम चेतावनी",
    alertText:"कल आपके क्षेत्र में हल्की बारिश की संभावना है।",viewBtn:"विवरण देखें ›",
    welcome:"🌾 नमस्ते! मैं आपका AgriAI सहायक हूं। फसल रोग, सिंचाई, उर्वरक या बाजार भाव के बारे में पूछें!",
    placeholder:"फसल, कीट, मौसम के बारे में पूछें...",
    nav:["होम","इतिहास","सहेजा","प्रोफाइल"],
    historyTitle:"चैट इतिहास",savedTitle:"सहेजे गए उत्तर",
    nameLabel:"आपका नाम",locationLabel:"स्थान",langPrefLabel:"पसंदीदा भाषा",
    saveProfileBtn:"💾 प्रोफाइल सहेजें",statChatsLabel:"कुल चैट",statSavedLabel:"सहेजे",statLangLabel:"भाषा",
    features:[
      {icon:"🌱",name:"फसल सलाह",desc:"फसलों के लिए सर्वोत्तम तरीके",q:"गेहूं के लिए फसल सलाह दें"},
      {icon:"🌦️",name:"मौसम",desc:"फसल के लिए मौसम सावधानी",q:"फसल के लिए मौसम सावधानी बताएं"},
      {icon:"🐛",name:"कीट नियंत्रण",desc:"कीट पहचानें और समाधान",q:"मेरी फसल पर कीट नियंत्रण कैसे करें?"},
      {icon:"₹",name:"बाजार भाव",desc:"लाइव मंडी दरें",q:"गेहूं के वर्तमान बाजार भाव क्या हैं?"},
      {icon:"🎓",name:"खेती टिप्स",desc:"रोज सीखें और बढ़ें",q:"इस मौसम के लिए खेती के टिप्स दें"},
      {icon:"🛡️",name:"सरकारी योजनाएं",desc:"प्रासंगिक योजनाएं",q:"किसानों के लिए कौन सी सरकारी योजनाएं हैं?"}
    ]
  },
  mr:{
    greeting:"शुभ सकाळ! 🌱",sub:"आज चांगली शेती करूया",
    askSub:"बोलण्यासाठी टॅप करा किंवा प्रश्न टाइप करा",quickLabel:"त्वरित क्रिया",
    langLabel:"उत्तर: मराठीत",alertTitle:"हवामान इशारा",
    alertText:"उद्या तुमच्या परिसरात हलका पाऊस अपेक्षित आहे.",viewBtn:"तपशील पहा ›",
    welcome:"🌾 नमस्कार! मी तुमचा AgriAI सहाय्यक आहे. पीक रोग, सिंचन, खते किंवा बाजारभावाबद्दल विचारा!",
    placeholder:"पिके, कीड, हवामानाबद्दल विचारा...",
    nav:["होम","इतिहास","जतन","प्रोफाइल"],
    historyTitle:"चॅट इतिहास",savedTitle:"जतन केलेली उत्तरे",
    nameLabel:"तुमचे नाव",locationLabel:"स्थान",langPrefLabel:"पसंतीची भाषा",
    saveProfileBtn:"💾 प्रोफाइल जतन करा",statChatsLabel:"एकूण चॅट",statSavedLabel:"जतन",statLangLabel:"भाषा",
    features:[
      {icon:"🌱",name:"पीक सल्ला",desc:"पिकांसाठी उत्तम पद्धती",q:"गव्हासाठी पीक सल्ला द्या"},
      {icon:"🌦️",name:"हवामान",desc:"पिकांसाठी हवामान सावधगिरी",q:"पिकांसाठी हवामान सावधगिरी सांगा"},
      {icon:"🐛",name:"कीड नियंत्रण",desc:"कीड ओळखा आणि उपाय",q:"माझ्या पिकावर कीड नियंत्रण कसे करावे?"},
      {icon:"₹",name:"बाजारभाव",desc:"थेट मंडी दर",q:"गव्हाचे सध्याचे बाजारभाव काय आहेत?"},
      {icon:"🎓",name:"शेतीचे टिप्स",desc:"रोज शिका आणि वाढा",q:"या हंगामासाठी शेतीचे टिप्स द्या"},
      {icon:"🛡️",name:"सरकारी योजना",desc:"संबंधित योजना शोधा",q:"शेतकऱ्यांसाठी कोणत्या सरकारी योजना आहेत?"}
    ]
  }
};

function setLang(lang, btn) {
  currentLang = lang;
  document.querySelectorAll(".lang-pill").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const t = T[lang];
  document.getElementById("greetingText").textContent = t.greeting;
  document.getElementById("greetingSub").textContent = t.sub;
  document.getElementById("askSub").textContent = t.askSub;
  document.getElementById("quickLabel").textContent = t.quickLabel;
  document.getElementById("langLabel").textContent = t.langLabel;
  document.getElementById("alertTitle").textContent = t.alertTitle;
  document.getElementById("alertText").textContent = t.alertText;
  document.getElementById("viewBtn").textContent = t.viewBtn;
  document.getElementById("welcomeMsg").textContent = t.welcome;
  document.getElementById("userInput").placeholder = t.placeholder;
  document.getElementById("historyTitle").textContent = t.historyTitle;
  document.getElementById("savedTitle").textContent = t.savedTitle;
  document.getElementById("nameLabel").textContent = t.nameLabel;
  document.getElementById("locationLabel").textContent = t.locationLabel;
  document.getElementById("langPrefLabel").textContent = t.langPrefLabel;
  document.getElementById("saveProfileBtn").textContent = t.saveProfileBtn;
  document.getElementById("statChatsLabel").textContent = t.statChatsLabel;
  document.getElementById("statSavedLabel").textContent = t.statSavedLabel;
  document.getElementById("statLangLabel").textContent = t.statLangLabel;
  ["nav1","nav2","nav3","nav4"].forEach((id,i) => document.getElementById(id).textContent = t.nav[i]);
}

// ── Plant Doctor: Image Preview & Gemini Vision Analysis ────────────────────
let plantImageBase64 = null;
let plantImageMime = 'image/jpeg';

function previewPlantImage(input) {
  const file = input.files[0];
  if (!file) return;
  plantImageMime = file.type || 'image/jpeg';
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    // Strip prefix to get pure base64
    plantImageBase64 = dataUrl.split(',')[1];
    const preview = document.getElementById('plantPreview');
    preview.src = dataUrl;
    preview.style.display = 'block';
    const btn = document.getElementById('analyzeBtn');
    btn.style.display = 'flex';
    document.getElementById('analyzeResult').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

async function analyzePlantImage() {
  if (!plantImageBase64) return;
  const btn = document.getElementById('analyzeBtn');
  const result = document.getElementById('analyzeResult');
  btn.textContent = '⏳ Analyzing...';
  btn.disabled = true;
  result.style.display = 'none';

  const prompt = currentLang === 'hi'
    ? 'इस पौधे की फोटो देखकर बताएं: 1) यह कौन सा पौधा/फसल है? 2) क्या इसमें कोई बीमारी या कीट समस्या है? 3) इसका इलाज क्या है? विस्तार से बताएं।'
    : currentLang === 'mr'
    ? 'या वनस्पतीचा फोटो पाहून सांगा: 1) हे कोणते रोप/पीक आहे? 2) त्यावर कोणता रोग किंवा कीड आहे का? 3) उपाय काय आहे? तपशीलवार सांगा.'
    : 'Look at this plant image and tell me: 1) What plant or crop is this? 2) Does it have any disease, pest infestation or nutrient deficiency? 3) What is the recommended treatment? Please be specific and practical for Indian farmers.';

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: plantImageMime, data: plantImageBase64 } }
          ]
        }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 600 }
      })
    });
    const data = await res.json();
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const analysis = data.candidates[0].content.parts[0].text.trim();
      result.innerHTML = '🌿 <b>Plant Analysis Result:</b><br><br>' + analysis.replace(/\n/g, '<br>');
      result.style.display = 'block';
      lastBotResponse = analysis;
      // Also show in chat
      const messages = document.getElementById('chatMessages');
      messages.innerHTML += `<div class="msg bot">🔬 <b>Plant Doctor Result:</b><br>${analysis.replace(/\n/g,'<br>')}<br><small style="color:var(--accent);cursor:pointer;font-size:10px;margin-top:4px;display:inline-block" onclick="saveCurrentResponse()">🔖 Save this</small></div>`;
      messages.scrollTop = messages.scrollHeight;
    } else {
      result.innerHTML = '⚠️ Could not analyze the image. Please try with a clearer photo.';
      result.style.display = 'block';
    }
  } catch (err) {
    result.innerHTML = '🌾 No internet connection. Please check your network and try again.';
    result.style.display = 'block';
  }

  btn.innerHTML = '🔬 Analyze Plant & Detect Disease';
  btn.disabled = false;
}

function showPage(page, navEl) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");
  navEl.classList.add("active");
  if (page === "history") loadHistory();
  if (page === "saved") loadSaved();
  if (page === "profile") loadProfile();
}

function toggleMic() {
  const btn = document.getElementById("micBtn");
  const wrap = document.getElementById("cropImgWrap");

  if (btn.classList.contains("listening")) {
    btn.classList.remove("listening");
    if(wrap) wrap.classList.remove("listening");
    return;
  }

  const langCode = currentLang === 'hi' ? 'hi-IN' : (currentLang === 'mr' ? 'mr-IN' : 'en-US');

  // Try Capacitor SpeechRecognition plugin first
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SpeechRecognition) {
    const SR = window.Capacitor.Plugins.SpeechRecognition;
    SR.requestPermissions().then(() => {
      btn.classList.add("listening");
      if(wrap) wrap.classList.add("listening");
      SR.start({ language: langCode, maxResults: 1, prompt: "Speak now", partialResults: false, popup: false })
        .then(result => {
          const text = (result.matches && result.matches[0]) || "";
          if(text) document.getElementById("userInput").value = text;
          btn.classList.remove("listening");
          if(wrap) wrap.classList.remove("listening");
          if(text) sendMessage();
        })
        .catch(err => {
          showToast("🎤 " + (err.message || "Could not recognize speech"));
          btn.classList.remove("listening");
          if(wrap) wrap.classList.remove("listening");
        });
    }).catch(() => {
      showToast("Microphone permission denied.");
    });
  } else if (window.startCapacitorMic) {
    btn.classList.add("listening");
    if(wrap) wrap.classList.add("listening");
    window.startCapacitorMic(langCode, (transcript) => {
      document.getElementById("userInput").value = transcript;
      btn.classList.remove("listening");
      if(wrap) wrap.classList.remove("listening");
      sendMessage();
    }, (errorMsg) => {
      showToast(errorMsg);
      btn.classList.remove("listening");
      if(wrap) wrap.classList.remove("listening");
    });
  } else {
    // Fallback: Web Speech API (browser)
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showToast("Microphone not supported on this device.");
      return;
    }
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Rec();
    rec.lang = langCode;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    btn.classList.add("listening");
    if(wrap) wrap.classList.add("listening");
    rec.start();
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      document.getElementById("userInput").value = text;
      btn.classList.remove("listening");
      if(wrap) wrap.classList.remove("listening");
      sendMessage();
    };
    rec.onerror = (e) => {
      showToast("🎤 " + e.error);
      btn.classList.remove("listening");
      if(wrap) wrap.classList.remove("listening");
    };
  }
}

async function quickAsk(text) {
  document.getElementById("userInput").value = text;
  await sendMessage();
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const messages = document.getElementById("chatMessages");
  const text = input.value.trim();
  if (!text) return;

  lastUserMessage = text;
  messages.innerHTML += `<div class="msg user">${text}</div>`;
  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  const tid = "typing-" + Date.now();
  messages.innerHTML += `<div class="msg bot" id="${tid}"><span class="dot-typing"><span></span><span></span><span></span></span></div>`;
  messages.scrollTop = messages.scrollHeight;

  chatHistory.push({ role: "user", parts: [{ text }] });

  // Keep only last 10 turns to stay within token limits
  if (chatHistory.length > 20) chatHistory = chatHistory.slice(chatHistory.length - 20);

  // Agricultural system instruction (correct Gemini API format)
  const systemInstruction = {
    parts: [{ text:
      "You are AgriAI, an expert agricultural assistant for Indian farmers. " +
      "Answer ONLY in the language the user is speaking (Hindi, Marathi, or English). " +
      "Keep answers practical, concise, and relevant to Indian farming. " +
      "Topics: crop diseases, pest control, irrigation, fertilizers, soil health, " +
      "weather precautions, mandi/market prices, government schemes for farmers. " +
      "Start every reply with a relevant farming emoji (🌾🌱🌽🌿🍅🌻💧🐛🌤️₹). " +
      "If asked something unrelated to farming, politely redirect to agricultural topics."
    }]
  };

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: systemInstruction,
        contents: chatHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512
        }
      })
    });

    const data = await res.json();
    document.getElementById(tid)?.remove();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const botReply = data.candidates[0].content.parts[0].text.trim();
      lastBotResponse = botReply;
      // Add model reply to history for context
      chatHistory.push({ role: "model", parts: [{ text: botReply }] });
      messages.innerHTML += `<div class="msg bot">${botReply}<br><small style="color:var(--accent);cursor:pointer;font-size:10px;margin-top:4px;display:inline-block" onclick="saveCurrentResponse()">🔖 Save this</small></div>`;
    } else if (data.error) {
      document.getElementById(tid)?.remove();
      const localReply = getLocalFarmingAnswer(text);
      lastBotResponse = localReply;
      messages.innerHTML += `<div class="msg bot">${localReply}<br><small style="color:var(--accent);cursor:pointer;font-size:10px;margin-top:4px;display:inline-block" onclick="saveCurrentResponse()">🔖 Save this</small></div>`;
    } else {
      messages.innerHTML += `<div class="msg bot">🌾 Sorry, I could not get a response. Please try again.</div>`;
    }
  } catch (err) {
    document.getElementById(tid)?.remove();
    const localReply = getLocalFarmingAnswer(text);
    lastBotResponse = localReply;
    messages.innerHTML += `<div class="msg bot">${localReply}<br><small style="color:var(--accent);cursor:pointer;font-size:10px;margin-top:4px;display:inline-block" onclick="saveCurrentResponse()">🔖 Save this</small></div>`;
  }

  messages.scrollTop = messages.scrollHeight;
}

// ── Local Farming Knowledge Base ─────────────────────────────────────────
function getLocalFarmingAnswer(q) {
  q = q.toLowerCase();
  if (q.match(/pest|insect|bug|kida|keeda|keet|कीट|कीड/))
    return "🐛 <b>Pest Control Tips:</b><br>• Spray <b>Neem oil</b> (5ml/litre) every 15 days<br>• Use <b>yellow sticky traps</b> for whiteflies & aphids<br>• Apply <b>Chlorpyrifos</b> for soil pests<br>• Practice <b>crop rotation</b> to break pest cycles<br>• Remove crop debris after harvest";
  if (q.match(/disease|fungus|blight|rot|rust|mildew|rog|रोग|बीमारी|कवक/))
    return "🌿 <b>Crop Disease Management:</b><br>• Spray <b>Mancozeb (0.25%)</b> for fungal diseases<br>• Use <b>Copper Oxychloride</b> for bacterial blight<br>• Ensure proper <b>drainage</b> to prevent root rot<br>• Remove and burn <b>infected plants</b> immediately<br>• Use certified <b>disease-resistant seeds</b>";
  if (q.match(/water|irrigation|drip|sinchai|सिंचाई|पानी|पाणी/))
    return "💧 <b>Irrigation Best Practices:</b><br>• <b>Drip irrigation</b> saves 40-60% water<br>• Water wheat every <b>10-12 days</b><br>• Best time: <b>early morning or evening</b><br>• Check soil moisture before irrigating<br>• <b>PM Sinchai Yojana</b>: 55% subsidy on drip systems";
  if (q.match(/fertilizer|urea|dap|npk|khad|खाद|उर्वरक/))
    return "🌱 <b>Fertilizer Guide:</b><br>• <b>DAP</b>: Apply at sowing for root growth<br>• <b>Urea</b>: Split in 2 doses — sowing & 30 days later<br>• <b>NPK 19:19:19</b>: Good for vegetables<br>• Use <b>vermicompost</b> (2-3 tonnes/acre)<br>• Get free <b>Soil Health Card</b> from KVK";
  if (q.match(/wheat|gehun|गेहूं|गहू/))
    return "🌾 <b>Wheat Farming Guide:</b><br>• Sowing: <b>November 1–25</b><br>• Seed rate: <b>40-45 kg/acre</b><br>• Fertilizer: <b>120:60:40 kg NPK/hectare</b><br>• Irrigate at: 21, 45, 65 days after sowing<br>• MSP 2024-25: <b>₹2,275/quintal</b>";
  if (q.match(/rice|paddy|dhan|chawal|धान|चावल|भात/))
    return "🌾 <b>Rice Farming Guide:</b><br>• Transplant at <b>15×15 cm</b> spacing<br>• Maintain <b>5 cm water level</b> till 2 weeks before harvest<br>• Apply <b>Urea in 3 splits</b><br>• Watch for <b>Blast disease</b> — spray Tricyclazole<br>• MSP: <b>₹2,183/quintal</b>";
  if (q.match(/tomato|tamatar|टमाटर|vegetable|sabji|sabzi|सब्जी/))
    return "🍅 <b>Vegetable Farming Tips:</b><br>• Use <b>raised beds</b> for better drainage<br>• Spray <b>Calcium Nitrate</b> to prevent Blossom End Rot<br>• Stake plants at 30 cm height<br>• Apply <b>Boron</b> for better fruit setting<br>• Spacing: Tomato 60×45 cm, Brinjal 75×60 cm";
  if (q.match(/soil|ph|mitti|माटी|मिट्टी|जमीन|माती/))
    return "🌍 <b>Soil Health Tips:</b><br>• Ideal pH: <b>6.0–7.5</b> for most crops<br>• Add <b>lime</b> if acidic (pH < 6)<br>• Add <b>gypsum</b> if alkaline (pH > 7.5)<br>• Test soil every <b>2 years</b> — free Soil Health Card<br>• Use <b>green manure</b> to improve organic matter";
  if (q.match(/market|price|mandi|rate|bhav|भाव|मंडी|किंमत/))
    return "₹ <b>MSP Rates 2024-25:</b><br>• Wheat: <b>₹2,275/quintal</b><br>• Rice: <b>₹2,183/quintal</b><br>• Maize: <b>₹2,090/quintal</b><br>• Soybean: <b>₹4,892/quintal</b><br>• Cotton: <b>₹7,521/quintal</b><br>📱 Live rates: <b>Agmarknet app</b> or eNAM portal";
  if (q.match(/scheme|yojana|government|govt|subsidy|सरकार|योजना|सबसिडी/))
    return "🛡️ <b>Key Schemes for Farmers:</b><br>• <b>PM-KISAN</b>: ₹6,000/year to your bank account<br>• <b>PM Fasal Bima</b>: Low-premium crop insurance<br>• <b>Kisan Credit Card</b>: Loan at 4% interest<br>• <b>PM Sinchai Yojana</b>: 55% subsidy on drip<br>📞 <b>Kisan Helpline: 1800-180-1551</b> (free, 24×7)";
  if (q.match(/weather|rain|forecast|mausam|barish|मौसम|बारिश|हवामान/))
    return "🌤️ <b>Weather Precautions:</b><br>• Use <b>Meghdoot app</b> for 5-day agri forecast<br>• Don't apply fertilizer/pesticide before heavy rain<br>• After rain: clear drainage, check waterlogging<br>• Dry spell: use <b>mulching</b> to retain moisture<br>• Cold wave: protect crops with <b>light night irrigation</b>";
  if (q.match(/seed|beej|बीज|बियाणे/))
    return "🌱 <b>Seed Tips:</b><br>• Buy <b>certified seeds</b> from authorized dealers<br>• Treat with <b>Thiram (2.5g/kg)</b> before sowing<br>• Store in <b>cool, dry, sealed containers</b><br>• Germination test: place 10 seeds on wet cloth — 7+ should sprout<br>• Get subsidized seeds from <b>state agriculture dept</b>";
  return "🌾 <b>Namaste! I'm AgriAI.</b><br>Ask me about:<br>• 🐛 Pest & disease control<br>• 💧 Irrigation tips<br>• 🌱 Fertilizer advice<br>• ₹ Market & MSP prices<br>• 🛡️ Government schemes<br>• 🌾 Wheat, Rice, Vegetables<br>• 🌦️ Weather precautions";
}

async function saveCurrentResponse() {
  if (!lastBotResponse) return;
  await fetch("/save", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({title: lastUserMessage.substring(0,50), content: lastBotResponse})});
  showToast("✅ Saved!");
}

async function loadHistory() {
  const list = document.getElementById("historyList");
  try {
    const res = await fetch("/history");
    const data = await res.json();
    if (!data.length) { list.innerHTML = '<div class="empty-state"><div class="empty-icon">💬</div><p>No history yet. Start chatting!</p></div>'; return; }
    list.innerHTML = data.map(h => `<div class="history-item"><div class="h-question">❓ ${h.user_message}</div><div class="h-answer">🌾 ${h.bot_response}</div><div class="h-meta"><span>${new Date(h.timestamp).toLocaleString()}</span><span class="save-chip" onclick="saveItem('${h.user_message.replace(/'/g,"&apos;")}','${h.bot_response.replace(/'/g,"&apos;")}')">🔖 Save</span></div></div>`).join("");
    document.getElementById("statChats").textContent = data.length;
  } catch(e) { list.innerHTML = '<div class="empty-state"><p>Could not load history.</p></div>'; }
}

async function saveItem(title, content) {
  await fetch("/save", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({title, content})});
  showToast("✅ Saved!");
}

async function loadSaved() {
  const list = document.getElementById("savedList");
  try {
    const res = await fetch("/saved");
    const data = await res.json();
    if (!data.length) { list.innerHTML = '<div class="empty-state"><div class="empty-icon">🔖</div><p>Nothing saved yet.</p></div>'; return; }
    list.innerHTML = data.map(s => `<div class="saved-item"><button class="delete-btn" onclick="deleteItem(${s.id})">✕</button><div class="s-title">📌 ${s.title}</div><div class="s-content">${s.content}</div><div class="s-meta">${new Date(s.timestamp).toLocaleString()}</div></div>`).join("");
    document.getElementById("statSaved").textContent = data.length;
  } catch(e) { list.innerHTML = '<div class="empty-state"><p>Could not load saved items.</p></div>'; }
}

async function deleteItem(id) {
  await fetch("/saved/"+id, {method:"DELETE"});
  loadSaved();
  showToast("🗑️ Deleted!");
}

async function loadProfile() {
  try {
    const [pr, hr, sr] = await Promise.all([fetch("/profile"), fetch("/history"), fetch("/saved")]);
    const profile = await pr.json();
    const hist = await hr.json();
    const saved = await sr.json();
    document.getElementById("profileName").value = profile.name || "";
    document.getElementById("profileLocation").value = profile.location || "";
    document.getElementById("profileLang").value = profile.preferred_language || "en";
    document.getElementById("profileNameDisplay").textContent = profile.name || "Farmer";
    document.getElementById("profileLocationDisplay").textContent = "📍 " + (profile.location || "Pune");
    document.getElementById("statChats").textContent = hist.length;
    document.getElementById("statSaved").textContent = saved.length;
  } catch(e) {}
}

async function saveProfile() {
  const name = document.getElementById("profileName").value;
  const location = document.getElementById("profileLocation").value;
  const language = document.getElementById("profileLang").value;
  await fetch("/profile", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({name, location, language})});
  document.getElementById("profileNameDisplay").textContent = name;
  document.getElementById("profileLocationDisplay").textContent = "📍 " + location;
  showToast("✅ Profile Saved!");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.style.display = "block";
  setTimeout(() => t.style.display = "none", 2500);
}

renderFeatures("en");

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      console.log('ServiceWorker registration successful');
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
