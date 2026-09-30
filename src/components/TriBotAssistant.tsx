import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Mic, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ExternalLink,
  MessageSquareText
} from 'lucide-react';

interface TriBotProps {
  lang: 'en' | 'hi';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actionTag?: string;
}

export const TriBotAssistant: React.FC<TriBotProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text:
        lang === 'en'
          ? 'Johar! I am TriBot, your AI Assistant for the Ministry of Tribal Affairs. How can I help you regarding the National Fellowship (NFST), Overseas Scholarship (NOS), or AI Caste Certificate Verification today?'
          : 'जोहार! मैं ट्राईबॉट (TriBot) हूँ, जनजातीय कार्य मंत्रालय का एआई सहायक। राष्ट्रीय अध्येतावृत्ति (NFST), प्रवासी छात्रवृत्ति (NOS), अथवा दस्तावेज़ सत्यापन के संबंध में आपकी क्या सहायता कर सकता हूँ?',
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    {
      label: lang === 'en' ? 'NFST Eligibility & Stipend' : 'एनएफएसटी पात्रता एवं राशि',
      query: 'Tell me about NFST Fellowship stipend amount, contingency, and income limit.',
    },
    {
      label: lang === 'en' ? 'AI OCR Caste Scan' : 'एआई जाति प्रमाण पत्र सत्यापन',
      query: 'How does AI Auto-Verification verify my ST Caste Certificate?',
    },
    {
      label: lang === 'en' ? 'PM-JANMAN PVTG Grant' : 'पीएम-जनमन पीवीटीजी अनुदान',
      query: 'What special benefits do PVTG students get under PM-JANMAN?',
    },
    {
      label: lang === 'en' ? 'Overseas NOS Scheme' : 'विदेशी छात्रवृत्ति (NOS)',
      query: 'What are the rules for National Overseas Scholarship (NOS) at top foreign universities?',
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not available or blocked:', e);
    }
  };

  const handleSend = (textToSend = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate smart contextual AI response mimicking Ministry AI
    setTimeout(() => {
      let botResponse = '';
      const lower = trimmed.toLowerCase();

      if (lower.includes('nfst') || lower.includes('fellowship') || lower.includes('phd') || lower.includes('stipend')) {
        botResponse =
          lang === 'en'
            ? 'The National Fellowship for Higher Education of ST Students (NFST) provides ₹37,000/month for Junior Research Fellows (JRF) and ₹42,000/month for Senior Research Fellows (SRF), plus up to ₹25,000 annual research contingency. The annual family income ceiling is ₹6.0 Lakhs. 750 slots are sanctioned annually by the Ministry of Tribal Affairs.'
            : 'राष्ट्रीय अध्येतावृत्ति (NFST) योजना के तहत नियमित एम.फिल/पीएचडी करने वाले अनुसूचित जनजाति शोधार्थियों को ₹37,000/माह (JRF) और ₹42,000/माह (SRF) तथा ₹25,000 वार्षिक आकस्मिक निधि प्रदान की जाती है। आय सीमा ₹6 लाख वार्षिक है।';
      } else if (lower.includes('ocr') || lower.includes('caste') || lower.includes('certificate') || lower.includes('verify')) {
        botResponse =
          lang === 'en'
            ? 'Our AI Auto-Verification module executes a 2-second deep learning neural scan of your certificate. It extracts the candidate name, father\'s name, community category, and validates the digital DSC signature of the Tehsildar/SDM against state gazettes with a 98% confidence score.'
            : 'हमारी एआई ऑटो-वेरिफिकेशन प्रणाली २ सेकंड में आपके प्रमाण पत्र का न्यूरल स्कैन कर राष्ट्रीय मुहर व अनुविभागीय अधिकारी के डिजिटल हस्ताक्षर का सत्यापन करती है और ९८% विश्वास स्कोर प्रदान करती है।';
      } else if (lower.includes('pvtg') || lower.includes('janman') || lower.includes('baiga') || lower.includes('birhor')) {
        botResponse =
          lang === 'en'
            ? 'Under the PM-JANMAN mission, all 75 Particularly Vulnerable Tribal Groups (PVTGs) receive top priority. Beneficiaries receive ₹40,000/month fellowship, expedited single-window Aadhaar approval, and higher income exemption limits up to ₹8.0 Lakhs/annum.'
            : 'पीएम-जनमन मिशन के तहत सभी ७५ पीवीटीजी जनजातियों के छात्रों को सर्वोच्च प्राथमिकता, ₹40,000/माह अध्येतावृत्ति, और शिथिल आय सीमा का लाभ दिया जाता है।';
      } else if (lower.includes('nos') || lower.includes('overseas') || lower.includes('abroad')) {
        botResponse =
          lang === 'en'
            ? 'The National Overseas Scholarship (NOS) fully covers 100% tuition fees, annual maintenance allowance (US $15,400 or £9,900), return airfare, and visa fees for ST scholars admitted to QS Top 500 foreign universities.'
            : 'राष्ट्रीय प्रवासी छात्रवृत्ति (NOS) योजना के अंतर्गत शीर्ष 500 विदेशी विश्वविद्यालयों में अध्ययन करने वाले एसटी छात्रों की १००% ट्यूशन फीस, वार्षिक जीवन व्यय और हवाई टिकट का पूरा खर्च मंत्रालय वहन करता है।';
      } else {
        botResponse =
          lang === 'en'
            ? 'Thank you for your question. You can use the AI Scheme Matchmaker to discover schemes tailored to your degree and income, or upload your Caste Certificate for instantaneous AI OCR verification with 98% confidence.'
            : 'धन्यवाद। आप अपनी योग्यता के अनुसार योजनाओं की जांच करने हेतु एआई मैचमेकर का उपयोग कर सकते हैं अथवा तुरंत प्रमाण पत्र सत्यापन करा सकते हैं।';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(botResponse);
    }, 600);
  };

  const handleSimulateVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const voiceQuery =
        lang === 'en'
          ? 'Am I eligible for NFST if my income is 2.5 Lakhs?'
          : 'क्या 2.5 लाख आय होने पर मुझे एनएफएसटी अध्येतावृत्ति मिल सकती है?';
      setInputText(voiceQuery);
      handleSend(voiceQuery);
    }, 1500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all">
          {/* Top Header */}
          <div className="bg-[#002244] text-white p-3.5 flex items-center justify-between border-b-2 border-[#FF9933]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-4 h-4 text-[#FF9933]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold tracking-tight">
                  TriBot Assistant (जनजातीय सहायक)
                </h4>
                <p className="text-[10px] text-slate-300">Ministry of Tribal Affairs AI Support</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className="p-1 rounded text-slate-300 hover:text-white"
                title={ttsEnabled ? 'Mute Voice Audio' : 'Enable Voice Audio'}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-300 hover:text-white text-lg font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick chip prompts */}
          <div className="p-2 bg-slate-100 border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p.query)}
                className="shrink-0 px-2 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 whitespace-nowrap"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="p-3 h-72 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#002244] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSimulateVoice}
              className={`p-2 rounded-lg transition-colors ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Voice Input (Hindi/English)"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'en' ? 'Ask TriBot in Hindi or English...' : 'पूछें (हिन्दी अथवा अंग्रेजी में)...'}
              className="flex-1 text-xs border rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002244]"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              className="p-2 bg-[#002244] text-white rounded-lg hover:bg-[#001730] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#002244] text-white rounded-full shadow-xl hover:bg-[#00152B] transition-all border-2 border-[#FF9933]"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF9933]"></span>
        </span>
        <span className="font-bold text-xs sm:text-sm tracking-wide">
          TriBot Assistant
        </span>
        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-slate-200 hidden sm:inline">
          {lang === 'en' ? 'AI Voice & Chat' : 'जनजातीय सहायक'}
        </span>
      </button>
    </div>
  );
};
