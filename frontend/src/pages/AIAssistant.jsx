import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, Send, User, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  "What's my total balance?",
  'Give me budgeting tips',
  'How do I make a transfer?',
  'Explain savings vs checking',
  'How can I grow my savings?',
];

const fmt = t => t
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.*?)\*/g, '<em>$1</em>')
  .replace(/\n/g, '<br/>');

export default function AIAssistant() {
  const [msgs,    setMsgs]    = useState([{
    role:'assistant',
    text:"Hello! I'm **BankBot**, your AI-powered banking assistant 🤖\n\nI can help with financial advice, account questions, and banking guidance. What can I help you with today?",
  }]);
  const [input,  setInput]   = useState('');
  const [busy,   setBusy]    = useState(false);
  const endRef = useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:'smooth' }); },[msgs,busy]);

  const send = async (text) => {
    const msg = (text||input).trim();
    if(!msg||busy) return;
    setInput('');
    const history = msgs.slice(1).map(m=>({ role:m.role, content:m.text }));
    setMsgs(p=>[...p,{ role:'user', text:msg }]);
    setBusy(true);
    try {
      const { data } = await axios.post('/ai/chat',{ message:msg, history });
      setMsgs(p=>[...p,{ role:'assistant', text:data.reply }]);
    } catch(err) {
      setMsgs(p=>[...p,{ role:'assistant', text:'⚠️ '+(err.response?.data?.reply||'Something went wrong.') }]);
    } finally { setBusy(false); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', padding:'28px 32px', boxSizing:'border-box' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, flexShrink:0 }}>
        <div style={{ width:46,height:46,borderRadius:14,background:'linear-gradient(135deg,#f59e0b,#fbbf24)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          <Bot size={22} color="#0f1f4a"/>
        </div>
        <div>
          <h1 style={{ color:'#fff',fontFamily:'Georgia,serif',fontSize:'1.75rem',fontWeight:700,margin:0,lineHeight:1 }}>AI Assistant</h1>
          <div style={{ display:'flex',alignItems:'center',gap:6,marginTop:5 }}>
            <div style={{ width:7,height:7,borderRadius:'50%',backgroundColor:'#34d399' }}/>
            <span style={{ color:'#475569',fontSize:'0.75rem',fontFamily:'sans-serif' }}>Powered by Ollama — llama3.2</span>
          </div>
        </div>
      </div>

      {/* Chat Box */}
      <div style={{
        flex:1, minHeight:0,
        display:'flex', flexDirection:'column',
        backgroundColor:'rgba(255,255,255,0.03)',
        border:'1px solid #1a1f3a',
        borderRadius:20,
        overflow:'hidden',
      }}>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 12px', display:'flex', flexDirection:'column', gap:14 }}>
          {msgs.map((m,i)=>(
            <div key={i} style={{ display:'flex', gap:10, flexDirection: m.role==='user' ? 'row-reverse':'row', alignItems:'flex-start' }}>
              {/* Avatar */}
              <div style={{
                width:32,height:32,borderRadius:9,flexShrink:0,
                background: m.role==='assistant' ? 'linear-gradient(135deg,#f59e0b,#fbbf24)' : 'rgba(255,255,255,0.08)',
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                {m.role==='assistant' ? <Bot size={16} color="#0f1f4a"/> : <User size={16} color="#94a3b8"/>}
              </div>
              {/* Bubble */}
              <div style={{
                maxWidth:'74%', padding:'10px 14px',
                borderRadius: m.role==='assistant' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                backgroundColor: m.role==='assistant' ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.1)',
                border: m.role==='assistant' ? '1px solid #1a1f3a' : '1px solid rgba(245,158,11,0.2)',
                color:'#e2e8f0', fontFamily:'sans-serif', fontSize:'0.875rem', lineHeight:1.65,
              }} dangerouslySetInnerHTML={{ __html: fmt(m.text) }}/>
            </div>
          ))}

          {/* Typing dots */}
          {busy && (
            <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <div style={{ width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#f59e0b,#fbbf24)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <Bot size={16} color="#0f1f4a"/>
              </div>
              <div style={{ padding:'12px 16px', borderRadius:'4px 14px 14px 14px', backgroundColor:'rgba(255,255,255,0.05)', border:'1px solid #1a1f3a', display:'flex', gap:5, alignItems:'center' }}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{ width:7,height:7,borderRadius:'50%',backgroundColor:'#f59e0b', animation:`dot 0.6s ease ${i*0.15}s infinite` }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        {/* Suggestions */}
        {msgs.length <= 1 && (
          <div style={{ padding:'0 20px 12px', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
              <Sparkles size={12} color="#475569"/>
              <span style={{ color:'#475569', fontSize:'0.72rem', fontFamily:'sans-serif' }}>Suggested questions</span>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {SUGGESTIONS.map(s=>(
                <button key={s} onClick={()=>send(s)} style={{
                  fontFamily:'sans-serif', fontSize:'0.75rem', color:'#64748b',
                  backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid #1a1f3a',
                  borderRadius:20, padding:'5px 12px', cursor:'pointer',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.color='#e2e8f0'; e.currentTarget.style.backgroundColor='rgba(255,255,255,0.08)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.color='#64748b'; e.currentTarget.style.backgroundColor='rgba(255,255,255,0.04)'; }}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div style={{ padding:'14px 20px', borderTop:'1px solid #1a1f3a', display:'flex', gap:10, flexShrink:0, backgroundColor:'rgba(0,0,0,0.15)' }}>
          <input
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); } }}
            placeholder="Ask me anything about your finances…"
            disabled={busy}
            style={{
              flex:1, backgroundColor:'rgba(255,255,255,0.06)', border:'1px solid #1e2a4a',
              borderRadius:12, padding:'10px 14px', color:'#fff',
              fontFamily:'sans-serif', fontSize:'0.875rem', outline:'none',
              opacity: busy ? 0.6 : 1,
            }}
            onFocus={e=>e.target.style.borderColor='rgba(245,158,11,0.5)'}
            onBlur={e=>e.target.style.borderColor='#1e2a4a'}
          />
          <button onClick={()=>send()} disabled={busy||!input.trim()} style={{
            width:44, height:44, borderRadius:12, flexShrink:0,
            background:'linear-gradient(135deg,#f59e0b,#fbbf24)',
            border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            opacity:(busy||!input.trim()) ? 0.4 : 1,
          }}>
            {busy
              ? <div style={{ width:15,height:15,border:'2px solid rgba(15,31,74,0.3)',borderTopColor:'#0f1f4a',borderRadius:'50%',animation:'spin 0.7s linear infinite' }}/>
              : <Send size={16} color="#0f1f4a"/>
            }
          </button>
        </div>

        {/* Footer note */}
        <p style={{ textAlign:'center', color:'#1e293b', fontSize:'0.68rem', fontFamily:'sans-serif', padding:'6px 16px 12px', flexShrink:0 }}>
          Requires Ollama — <code>ollama serve</code> + <code>ollama pull llama3.2</code>
        </p>
      </div>

      <style>{`
        @keyframes dot  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}