
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bot, Building2, Headphones, LayoutDashboard, LockKeyhole, LogOut,
  Mic, MicOff, Moon, Send, ShieldCheck, Sun, ThumbsDown, ThumbsUp,
  UserRound, Volume2, Languages
} from "lucide-react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const LANGUAGES = {
  en: { name: "English", locale: "en-IN", dir: "ltr" },
  hi: { name: "हिन्दी", locale: "hi-IN", dir: "ltr" },
  fr: { name: "Français", locale: "fr-FR", dir: "ltr" },
  es: { name: "Español", locale: "es-ES", dir: "ltr" },
  de: { name: "Deutsch", locale: "de-DE", dir: "ltr" },
  zh: { name: "中文", locale: "zh-CN", dir: "ltr" },
  ja: { name: "日本語", locale: "ja-JP", dir: "ltr" },
  ar: { name: "العربية", locale: "ar-SA", dir: "rtl" },
};

const UI = {
  en: {
    support: "Straight2Bank Support", hero: "Secure 24×7 AI voice support",
    sub: "Instant governed answers, lower wait time and seamless human escalation.",
    approved: "Approved knowledge", voice: "Voice and text", handoff: "Human handoff",
    login: "Secure demo login", org: "Organisation ID", user: "User ID", password: "Password",
    signIn: "Sign in", signing: "Signing in…", prototype: "Prototype only. No real bank account is connected.",
    assistant: "Assistant", dashboard: "Dashboard", logout: "Logout",
    hello: "Hello {name}. How may I help you today?", online: "Online · 24×7",
    auth: "Authenticated", warning: "Never share password, PIN, OTP or full account number.",
    placeholder: "Type your service query", listening: "Listening…", thinking: "Thinking…",
    source: "Source", confidence: "Confidence", read: "Read aloud", helpful: "Helpful",
    notHelpful: "Not helpful", ticket: "Support request {id} created",
    total: "Total queries", automated: "Automated resolutions", escalations: "Escalations",
    avg: "Average confidence", top: "Top intents", recent: "Recent conversations",
    query: "Query", intent: "Intent", outcome: "Outcome", resolved: "Resolved",
    escalated: "Escalated", empty: "No conversations yet.", loading: "Loading dashboard…",
    micUnsupported: "Voice recognition is not supported. Use Chrome or Edge.",
    suggestions: ["How do I reset my password?", "Why is my payment pending?", "How can I download a statement?", "My bulk payment file was rejected"]
  },
  hi: {
    support: "स्ट्रेट2बैंक सहायता", hero: "सुरक्षित 24×7 एआई वॉइस सहायता",
    sub: "तुरंत विश्वसनीय उत्तर, कम प्रतीक्षा और आसान मानव सहायता।",
    approved: "स्वीकृत ज्ञान", voice: "वॉइस और टेक्स्ट", handoff: "मानव सहायता",
    login: "सुरक्षित डेमो लॉगिन", org: "संगठन आईडी", user: "यूज़र आईडी", password: "पासवर्ड",
    signIn: "साइन इन", signing: "साइन इन हो रहा है…", prototype: "केवल प्रोटोटाइप। कोई वास्तविक बैंक खाता जुड़ा नहीं है।",
    assistant: "सहायक", dashboard: "डैशबोर्ड", logout: "लॉगआउट",
    hello: "नमस्ते {name}, मैं आपकी कैसे मदद कर सकता हूँ?", online: "ऑनलाइन · 24×7",
    auth: "प्रमाणित", warning: "पासवर्ड, पिन, ओटीपी या पूरा खाता नंबर साझा न करें।",
    placeholder: "अपना सेवा प्रश्न लिखें", listening: "सुन रहा हूँ…", thinking: "सोच रहा हूँ…",
    source: "स्रोत", confidence: "विश्वास", read: "सुनें", helpful: "सहायक", notHelpful: "सहायक नहीं",
    ticket: "सहायता अनुरोध {id} बनाया गया", total: "कुल प्रश्न", automated: "स्वचालित समाधान",
    escalations: "एस्केलेशन", avg: "औसत विश्वास", top: "मुख्य इंटेंट", recent: "हाल की बातचीत",
    query: "प्रश्न", intent: "इंटेंट", outcome: "परिणाम", resolved: "समाधान", escalated: "एस्केलेटेड",
    empty: "अभी कोई बातचीत नहीं।", loading: "डैशबोर्ड लोड हो रहा है…",
    micUnsupported: "वॉइस पहचान समर्थित नहीं है। Chrome या Edge उपयोग करें।",
    suggestions: ["पासवर्ड कैसे रीसेट करूँ?", "मेरा भुगतान लंबित क्यों है?", "स्टेटमेंट कैसे डाउनलोड करूँ?", "मेरी बल्क पेमेंट फ़ाइल रिजेक्ट हो गई"]
  },
  fr: {
    support: "Assistance Straight2Bank", hero: "Assistance vocale IA sécurisée 24h/24",
    sub: "Réponses immédiates, attente réduite et transfert fluide vers un conseiller.",
    approved: "Base approuvée", voice: "Voix et texte", handoff: "Transfert humain",
    login: "Connexion démo sécurisée", org: "ID organisation", user: "ID utilisateur", password: "Mot de passe",
    signIn: "Se connecter", signing: "Connexion…", prototype: "Prototype uniquement. Aucun compte réel n'est connecté.",
    assistant: "Assistant", dashboard: "Tableau de bord", logout: "Déconnexion",
    hello: "Bonjour {name}. Comment puis-je vous aider ?", online: "En ligne · 24h/24",
    auth: "Authentifié", warning: "Ne partagez jamais mot de passe, PIN, OTP ou numéro de compte complet.",
    placeholder: "Saisissez votre demande", listening: "Écoute…", thinking: "Réflexion…",
    source: "Source", confidence: "Confiance", read: "Lire", helpful: "Utile", notHelpful: "Pas utile",
    ticket: "Demande d'assistance {id} créée", total: "Demandes totales", automated: "Résolutions automatiques",
    escalations: "Escalades", avg: "Confiance moyenne", top: "Intentions principales", recent: "Conversations récentes",
    query: "Demande", intent: "Intention", outcome: "Résultat", resolved: "Résolu", escalated: "Escaladé",
    empty: "Aucune conversation.", loading: "Chargement…", micUnsupported: "Reconnaissance vocale non prise en charge. Utilisez Chrome ou Edge.",
    suggestions: ["Comment réinitialiser mon mot de passe ?", "Pourquoi mon paiement est-il en attente ?", "Comment télécharger un relevé ?", "Mon fichier de paiement groupé a été rejeté"]
  },
  es: {
    support: "Soporte Straight2Bank", hero: "Soporte de voz con IA seguro 24×7",
    sub: "Respuestas inmediatas, menos espera y transferencia sencilla a un agente.",
    approved: "Conocimiento aprobado", voice: "Voz y texto", handoff: "Atención humana",
    login: "Inicio de sesión demo", org: "ID de organización", user: "ID de usuario", password: "Contraseña",
    signIn: "Iniciar sesión", signing: "Iniciando…", prototype: "Solo prototipo. No hay cuentas reales conectadas.",
    assistant: "Asistente", dashboard: "Panel", logout: "Salir", hello: "Hola {name}. ¿Cómo puedo ayudarte?",
    online: "En línea · 24×7", auth: "Autenticado", warning: "No compartas contraseña, PIN, OTP ni el número completo de cuenta.",
    placeholder: "Escribe tu consulta", listening: "Escuchando…", thinking: "Pensando…",
    source: "Fuente", confidence: "Confianza", read: "Leer", helpful: "Útil", notHelpful: "No útil",
    ticket: "Solicitud {id} creada", total: "Consultas totales", automated: "Resoluciones automáticas",
    escalations: "Escalaciones", avg: "Confianza media", top: "Intenciones principales", recent: "Conversaciones recientes",
    query: "Consulta", intent: "Intención", outcome: "Resultado", resolved: "Resuelto", escalated: "Escalado",
    empty: "Sin conversaciones.", loading: "Cargando…", micUnsupported: "Reconocimiento de voz no disponible. Usa Chrome o Edge.",
    suggestions: ["¿Cómo restablezco mi contraseña?", "¿Por qué está pendiente mi pago?", "¿Cómo descargo un extracto?", "Mi archivo de pagos fue rechazado"]
  },
  de: {
    support: "Straight2Bank Support", hero: "Sicherer KI-Sprachsupport rund um die Uhr",
    sub: "Sofortige Antworten, kürzere Wartezeiten und nahtlose Übergabe an Mitarbeitende.",
    approved: "Freigegebenes Wissen", voice: "Sprache und Text", handoff: "Menschliche Übergabe",
    login: "Sichere Demo-Anmeldung", org: "Organisations-ID", user: "Benutzer-ID", password: "Passwort",
    signIn: "Anmelden", signing: "Anmeldung…", prototype: "Nur Prototyp. Kein echtes Bankkonto verbunden.",
    assistant: "Assistent", dashboard: "Dashboard", logout: "Abmelden", hello: "Hallo {name}. Wie kann ich helfen?",
    online: "Online · 24×7", auth: "Authentifiziert", warning: "Teilen Sie niemals Passwort, PIN, OTP oder vollständige Kontonummer.",
    placeholder: "Serviceanfrage eingeben", listening: "Hört zu…", thinking: "Denkt nach…",
    source: "Quelle", confidence: "Konfidenz", read: "Vorlesen", helpful: "Hilfreich", notHelpful: "Nicht hilfreich",
    ticket: "Supportanfrage {id} erstellt", total: "Anfragen gesamt", automated: "Automatische Lösungen",
    escalations: "Eskalationen", avg: "Durchschnittliche Konfidenz", top: "Top-Intents", recent: "Letzte Gespräche",
    query: "Anfrage", intent: "Intent", outcome: "Ergebnis", resolved: "Gelöst", escalated: "Eskaliert",
    empty: "Noch keine Gespräche.", loading: "Dashboard wird geladen…", micUnsupported: "Spracherkennung wird nicht unterstützt. Chrome oder Edge verwenden.",
    suggestions: ["Wie setze ich mein Passwort zurück?", "Warum ist meine Zahlung ausstehend?", "Wie lade ich einen Kontoauszug herunter?", "Meine Sammelzahlungsdatei wurde abgelehnt"]
  },
  zh: {
    support: "Straight2Bank 支持", hero: "安全的 24×7 AI 语音支持", sub: "即时合规回答、更短等待时间和无缝人工转接。",
    approved: "已批准知识", voice: "语音和文字", handoff: "人工转接", login: "安全演示登录",
    org: "机构 ID", user: "用户 ID", password: "密码", signIn: "登录", signing: "登录中…",
    prototype: "仅为原型，不连接真实银行账户。", assistant: "助手", dashboard: "仪表板", logout: "退出",
    hello: "您好 {name}，我能为您做什么？", online: "在线 · 24×7", auth: "已认证",
    warning: "请勿分享密码、PIN、OTP 或完整账户号码。", placeholder: "输入您的服务问题", listening: "正在聆听…",
    thinking: "思考中…", source: "来源", confidence: "置信度", read: "朗读", helpful: "有帮助", notHelpful: "无帮助",
    ticket: "已创建支持请求 {id}", total: "总查询", automated: "自动解决", escalations: "升级",
    avg: "平均置信度", top: "主要意图", recent: "最近对话", query: "查询", intent: "意图",
    outcome: "结果", resolved: "已解决", escalated: "已升级", empty: "暂无对话。", loading: "加载中…",
    micUnsupported: "不支持语音识别，请使用 Chrome 或 Edge。",
    suggestions: ["如何重置密码？", "为什么我的付款处于待处理状态？", "如何下载对账单？", "我的批量付款文件被拒绝"]
  },
  ja: {
    support: "Straight2Bank サポート", hero: "安全な24時間AI音声サポート", sub: "即時回答、待ち時間削減、スムーズな有人対応。",
    approved: "承認済み知識", voice: "音声とテキスト", handoff: "有人対応", login: "安全なデモログイン",
    org: "組織ID", user: "ユーザーID", password: "パスワード", signIn: "ログイン", signing: "ログイン中…",
    prototype: "プロトタイプです。実口座には接続されません。", assistant: "アシスタント", dashboard: "ダッシュボード", logout: "ログアウト",
    hello: "こんにちは {name}。どのようにお手伝いできますか？", online: "オンライン · 24×7", auth: "認証済み",
    warning: "パスワード、PIN、OTP、完全な口座番号を共有しないでください。", placeholder: "お問い合わせを入力", listening: "聞いています…",
    thinking: "考えています…", source: "情報源", confidence: "信頼度", read: "読み上げ", helpful: "役立つ", notHelpful: "役立たない",
    ticket: "サポート依頼 {id} を作成しました", total: "総問い合わせ", automated: "自動解決", escalations: "エスカレーション",
    avg: "平均信頼度", top: "主要インテント", recent: "最近の会話", query: "問い合わせ", intent: "インテント",
    outcome: "結果", resolved: "解決", escalated: "エスカレーション", empty: "会話はまだありません。", loading: "読み込み中…",
    micUnsupported: "音声認識はサポートされていません。Chrome または Edge を使用してください。",
    suggestions: ["パスワードをリセットするには？", "支払いが保留中なのはなぜですか？", "明細をダウンロードするには？", "一括支払いファイルが拒否されました"]
  },
  ar: {
    support: "دعم Straight2Bank", hero: "دعم صوتي آمن بالذكاء الاصطناعي على مدار الساعة",
    sub: "إجابات فورية وتقليل وقت الانتظار وتحويل سلس إلى موظف.",
    approved: "معرفة معتمدة", voice: "صوت ونص", handoff: "تحويل لموظف", login: "تسجيل دخول تجريبي آمن",
    org: "معرّف المؤسسة", user: "معرّف المستخدم", password: "كلمة المرور", signIn: "تسجيل الدخول",
    signing: "جارٍ تسجيل الدخول…", prototype: "نموذج أولي فقط. لا يوجد حساب مصرفي حقيقي متصل.",
    assistant: "المساعد", dashboard: "لوحة التحكم", logout: "تسجيل الخروج",
    hello: "مرحباً {name}. كيف يمكنني مساعدتك؟", online: "متصل · 24×7", auth: "تم التحقق",
    warning: "لا تشارك كلمة المرور أو PIN أو OTP أو رقم الحساب الكامل.", placeholder: "اكتب استفسارك",
    listening: "جارٍ الاستماع…", thinking: "جارٍ التفكير…", source: "المصدر", confidence: "الثقة",
    read: "قراءة", helpful: "مفيد", notHelpful: "غير مفيد", ticket: "تم إنشاء طلب الدعم {id}",
    total: "إجمالي الاستفسارات", automated: "الحلول الآلية", escalations: "التصعيدات", avg: "متوسط الثقة",
    top: "أهم النوايا", recent: "المحادثات الأخيرة", query: "الاستفسار", intent: "النية",
    outcome: "النتيجة", resolved: "تم الحل", escalated: "تم التصعيد", empty: "لا توجد محادثات بعد.",
    loading: "جارٍ التحميل…", micUnsupported: "التعرف على الصوت غير مدعوم. استخدم Chrome أو Edge.",
    suggestions: ["كيف أعيد تعيين كلمة المرور؟", "لماذا دفعي معلق؟", "كيف أنزل كشف الحساب؟", "تم رفض ملف الدفعات المجمعة"]
  }
};

function makeSessionId() {
  return globalThis.crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
async function parseResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(data.detail || `Request failed (${response.status})`);
  return data;
}
function usePreferences() {
  const [theme, setTheme] = useState(() => localStorage.getItem("s2b-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  const [language, setLanguage] = useState(() => localStorage.getItem("s2b-language") || "en");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("s2b-theme", theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("s2b-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = LANGUAGES[language].dir;
  }, [language]);
  return { theme, setTheme, language, setLanguage };
}
function Controls({ theme, setTheme, language, setLanguage }) {
  return <div className="controls">
    <label className="language-control"><Languages size={17}/><select value={language} onChange={e=>setLanguage(e.target.value)}>
      {Object.entries(LANGUAGES).map(([code, info]) => <option key={code} value={code}>{info.name}</option>)}
    </select></label>
    <button type="button" className="icon-button" onClick={()=>setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme">
      {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
    </button>
  </div>;
}

function Login({ onLogin, prefs }) {
  const t = UI[prefs.language];
  const [form, setForm] = useState({ organisation_id:"ACME001", user_id:"demo.user", password:"demo123" });
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e){e.preventDefault();setError("");setLoading(true);try{
    const r=await fetch(`${API}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    onLogin(await parseResponse(r));
  }catch(err){setError(`${err.message}. Confirm backend is running on port 8000.`)}finally{setLoading(false)}}
  return <main className="login-shell">
    <div className="floating-controls"><Controls {...prefs}/></div>
    <section className="login-brand"><div className="brand-mark"><Building2 size={34}/></div><p className="eyebrow">{t.support}</p>
      <h1>{t.hero}</h1><p>{t.sub}</p><div className="feature-list">
        <span><ShieldCheck size={18}/>{t.approved}</span><span><Volume2 size={18}/>{t.voice}</span><span><Headphones size={18}/>{t.handoff}</span>
      </div></section>
    <form className="login-card" onSubmit={submit}><div className="login-icon"><LockKeyhole size={26}/></div><h2>{t.login}</h2>
      <label>{t.org}<input value={form.organisation_id} onChange={e=>setForm({...form,organisation_id:e.target.value})}/></label>
      <label>{t.user}<input value={form.user_id} onChange={e=>setForm({...form,user_id:e.target.value})}/></label>
      <label>{t.password}<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
      {error&&<div className="error">{error}</div>}<button className="primary" disabled={loading}>{loading?t.signing:t.signIn}</button><small>{t.prototype}</small>
    </form></main>
}
function Metric({label,value}){return <div className="metric"><span>{label}</span><strong>{value}</strong></div>}
function Dashboard({token,onExpired,language}) {
  const t=UI[language]; const [stats,setStats]=useState(null); const [error,setError]=useState("");
  useEffect(()=>{fetch(`${API}/dashboard`,{headers:{Authorization:`Bearer ${token}`}}).then(async r=>{if(r.status===401){onExpired();return null}return parseResponse(r)}).then(d=>d&&setStats(d)).catch(e=>setError(e.message))},[token,onExpired]);
  if(error)return <div className="panel error">{error}</div>; if(!stats)return <div className="panel loading">{t.loading}</div>;
  return <div className="dashboard"><div className="metric-grid"><Metric label={t.total} value={stats.total_queries}/><Metric label={t.automated} value={stats.automated_resolutions}/><Metric label={t.escalations} value={stats.escalations}/><Metric label={t.avg} value={`${Math.round(stats.average_confidence*100)}%`}/></div>
    <section className="panel"><h3>{t.top}</h3>{stats.top_intents.length===0?<p>{t.empty}</p>:stats.top_intents.map(x=><div className="intent-row" key={x.intent}><span>{x.intent.replaceAll("_"," ")}</span><strong>{x.count}</strong></div>)}</section>
    <section className="panel wide"><h3>{t.recent}</h3><div className="table-wrap"><table><thead><tr><th>{t.query}</th><th>{t.intent}</th><th>{t.confidence}</th><th>{t.outcome}</th></tr></thead><tbody>{stats.recent_queries.map((r,i)=><tr key={i}><td>{r.user_message}</td><td>{r.intent.replaceAll("_"," ")}</td><td>{Math.round(r.confidence*100)}%</td><td>{r.escalated?t.escalated:t.resolved}</td></tr>)}</tbody></table></div></section>
  </div>
}
function Chat({token,profile,onExpired,language}) {
  const t=UI[language], sessionId=useMemo(makeSessionId,[]), endRef=useRef(null);
  const [messages,setMessages]=useState([{role:"assistant",text:t.hello.replace("{name}",profile.customer_name),confidence:1}]);
  const [input,setInput]=useState(""); const [listening,setListening]=useState(false); const [loading,setLoading]=useState(false);
  useEffect(()=>{setMessages([{role:"assistant",text:t.hello.replace("{name}",profile.customer_name),confidence:1}])},[language]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);
  function speak(text){if(!("speechSynthesis" in window))return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.rate=.95;u.lang=LANGUAGES[language].locale;speechSynthesis.speak(u)}
  function startListening(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){alert(t.micUnsupported);return}const r=new SR();r.lang=LANGUAGES[language].locale;r.interimResults=false;r.continuous=false;r.onstart=()=>setListening(true);r.onend=()=>setListening(false);r.onerror=()=>setListening(false);r.onresult=e=>sendMessage(e.results[0][0].transcript,"voice");r.start()}
  async function sendMessage(value=input,channel="text"){const message=typeof value==="string"?value.trim():input.trim();if(!message||loading)return;setMessages(o=>[...o,{role:"user",text:message}]);setInput("");setLoading(true);try{
    const r=await fetch(`${API}/chat`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({message,session_id:sessionId,channel,language})});
    if(r.status===401){onExpired();return}const d=await parseResponse(r);setMessages(o=>[...o,{role:"assistant",text:d.answer,confidence:d.confidence,sources:d.sources||[],ticketId:d.ticket_id,safeMessage:d.safe_message}]);if(channel==="voice")speak(d.answer)
  }catch(e){setMessages(o=>[...o,{role:"assistant",text:`Unable to process your request: ${e.message}`}])}finally{setLoading(false)}}
  async function feedback(helpful){try{await fetch(`${API}/feedback`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({session_id:sessionId,helpful})})}catch{}}
  return <div className="chat-layout"><aside className="context-card"><div className="avatar"><UserRound size={24}/></div><h3>{profile.customer_name}</h3><p>{profile.organisation_name}</p><hr/><div className="secure-line"><ShieldCheck size={17}/>{t.auth}</div><p className="disclaimer">{t.warning}</p></aside>
    <section className="chat-panel"><div className="chat-header"><div className="agent-icon"><Bot size={24}/></div><div><h2>S2B AI Voice Agent</h2><span><i/>{t.online}</span></div></div>
      <div className="messages">{messages.map((m,i)=><div className={`message-row ${m.role}`} key={i}><div className="bubble"><p>{m.text}</p>{m.safeMessage&&<small className="safe-note">{m.safeMessage}</small>}
        {m.sources?.length>0&&<div className="sources">{t.source}: {m.sources.map(s=>`${s.title} · ${s.section}`).join(", ")}</div>}
        {m.confidence!==undefined&&m.role==="assistant"&&i>0&&<div className="message-meta"><span className={m.confidence>=.6?"good":"warn"}>{t.confidence} {Math.round(m.confidence*100)}%</span><button type="button" onClick={()=>speak(m.text)} title={t.read}><Volume2 size={15}/></button><button type="button" onClick={()=>feedback(true)} title={t.helpful}><ThumbsUp size={15}/></button><button type="button" onClick={()=>feedback(false)} title={t.notHelpful}><ThumbsDown size={15}/></button></div>}
        {m.ticketId&&<div className="ticket"><Headphones size={16}/>{t.ticket.replace("{id}",m.ticketId)}</div>}</div></div>)}{loading&&<div className="message-row assistant"><div className="bubble typing">{t.thinking}</div></div>}<div ref={endRef}/></div>
      <div className="suggestions">{t.suggestions.map(s=><button type="button" key={s} onClick={()=>sendMessage(s)}>{s}</button>)}</div>
      <div className="composer"><button type="button" className={`mic ${listening?"active":""}`} onClick={startListening}>{listening?<MicOff/>:<Mic/>}</button><input value={input} placeholder={listening?t.listening:t.placeholder} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();sendMessage()}}}/><button type="button" className="send" onClick={()=>sendMessage()} disabled={loading}><Send size={20}/></button></div>
    </section></div>
}
function App(){
  const prefs=usePreferences(), t=UI[prefs.language];
  const [auth,setAuth]=useState(()=>{try{return JSON.parse(sessionStorage.getItem("s2b-auth"))}catch{return null}});
  const [view,setView]=useState("chat");
  function login(d){setAuth(d);sessionStorage.setItem("s2b-auth",JSON.stringify(d))}
  function clear(){setAuth(null);sessionStorage.removeItem("s2b-auth")}
  async function logout(){try{await fetch(`${API}/logout`,{method:"POST",headers:{Authorization:`Bearer ${auth.access_token}`}})}finally{clear()}}
  if(!auth)return <Login onLogin={login} prefs={prefs}/>;
  return <div className="app-shell"><header className="topbar"><div className="wordmark"><Building2/><strong>S2B</strong><span>AI Support</span></div><nav><button className={view==="chat"?"selected":""} onClick={()=>setView("chat")}><Bot size={17}/>{t.assistant}</button><button className={view==="dashboard"?"selected":""} onClick={()=>setView("dashboard")}><LayoutDashboard size={17}/>{t.dashboard}</button><Controls {...prefs}/><button onClick={logout}><LogOut size={17}/>{t.logout}</button></nav></header>
    <main className="content">{view==="chat"?<Chat token={auth.access_token} profile={auth} onExpired={clear} language={prefs.language}/>:<Dashboard token={auth.access_token} onExpired={clear} language={prefs.language}/>}</main>
  </div>
}
createRoot(document.getElementById("root")).render(<App/>);
