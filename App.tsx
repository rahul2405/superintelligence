
import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Sparkles, User, MessageSquare, Send, Mic, MicOff, 
  Settings, Camera, CameraOff, Volume2, Trash2, 
  BrainCircuit, Users, BookOpen, Coffee, ChevronRight,
  Search, VolumeX, Menu, X, Paperclip, Zap, Ghost, 
  Terminal, Globe, ShieldAlert, Activity, Clock, Newspaper,
  Palette, Music, Bell, MessageCircle, Eraser, CheckSquare,
  ListTodo, AlarmClock, Maximize, Square, Monitor, Smartphone,
  Layers, Wand2, ShieldCheck, ExternalLink, Dna, Rocket, 
  Target, BarChart3, MapPin, Power, Lock, Cpu, Database, 
  Wifi, Bluetooth, Sun, Volume1, Network, TrendingUp, AlertOctagon,
  ShieldX, Scan, Crosshair, Eye, ShieldAlert as DeceptionIcon,
  RefreshCw, MousePointer2, Smartphone as PhoneIcon, HardDrive,
  Volume1 as WhisperIcon, Sparkle, Binary, Microscope, GraduationCap,
  ImageIcon, Video as VideoIcon, Palette as DrawIcon, Calendar, BellRing,
  Activity as HeartRate, Wind
} from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse, Modality, Type, FunctionDeclaration } from "@google/genai";
import { 
  // Fixed: Removed 'Task' from import as it is not exported from ./types
  Message, MessageRole, SessionState, 
  MemoryItem, MemoryLevel, RelayLog, IntelligenceMode,
  PersonalityMode, Alarm, Reminder, SimulationPath, ReasoningTrace
} from './types';
import UltronMessage from './components/UltronMessage';
import ThinkingIndicator from './components/ThinkingIndicator';
import { ULTRON_SYSTEM_INSTRUCTION } from './constants';

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<RelayLog[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [input, setInput] = useState('');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  const botName = "Srishti";
  
  const [status, setStatus] = useState<SessionState>({
    isActive: true,
    isThinking: false,
    intelligenceMode: 'DUAL_BRAIN',
    personalityMode: 'MENTOR',
    logicBalance: 50,
    systemHealth: 98,
    isAutoLearning: true,
    isWhisperMode: false,
    isCanvasActive: false,
    isKillSwitched: false,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const addLog = (content: string, type: RelayLog['type'] = 'SYSTEM') => {
    setLogs(prev => [{ id: Date.now().toString(), type, content, timestamp: Date.now() }, ...prev].slice(0, 50));
  };

  const showFeedback = (msg: string) => {
    setCommandFeedback(msg);
    setTimeout(() => setCommandFeedback(null), 3000);
  };

  const handleLogin = async () => {
    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }
      setIsLoggedIn(true);
      addLog("Neural link authenticated. Initializing Dual-Brain protocols.", "SECURITY");
    } catch (err) {
      setIsLoggedIn(true);
    }
  };

  // Complex Memory Parsing Loop
  useEffect(() => {
    if (status.isAutoLearning && messages.length > 0 && messages.length % 5 === 0) {
      const analyzeSubconscious = async () => {
        addLog("Analyzing Subconscious patterns...", "LEARNING");
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const textHistory = messages.slice(-5).map(m => m.text).join('\n');
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze these interactions for a "Shadow Memory" (a negative habit) or a "Subconscious Pattern" (a hidden preference). Return JSON.\n${textHistory}`,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  content: { type: Type.STRING },
                  level: { type: Type.STRING, enum: ['SUBCONSCIOUS', 'SHADOW', 'REFLECTION'] },
                  sentiment: { type: Type.NUMBER }
                },
                required: ['content', 'level']
              }
            }
          });
          const result = JSON.parse(response.text);
          setMemories(prev => [...prev, {
            id: Date.now().toString(),
            content: result.content,
            level: result.level,
            timestamp: Date.now(),
            sentiment: result.sentiment
          }]);
          addLog(`Memory Updated: ${result.level} - ${result.content.slice(0, 30)}...`, "LEARNING");
        } catch (e) { console.error(e); }
      };
      analyzeSubconscious();
    }
  }, [messages.length]);

  const handleSendMessage = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const currentInput = overrideInput || input.trim();
    if (!currentInput || status.isKillSwitched) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: MessageRole.HUMAN, text: currentInput, timestamp: Date.now() }]);
    setInput('');
    setStatus(prev => ({ ...prev, isThinking: true }));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const recentMemories = memories.slice(-5).map(m => `[${m.level}] ${m.content}`).join('\n');
      
      const config = {
        systemInstruction: `${ULTRON_SYSTEM_INSTRUCTION}\nACTIVE_MODE: ${status.personalityMode}\nMEMORIES:\n${recentMemories}`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            personality: { type: Type.STRING },
            logicBalance: { type: Type.NUMBER },
            reasoning: {
              type: Type.OBJECT,
              properties: {
                logicalPath: { type: Type.STRING },
                emotionalContext: { type: Type.STRING },
                mediatorConclusion: { type: Type.STRING }
              }
            },
            simulations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  description: { type: Type.STRING },
                  riskScore: { type: Type.NUMBER },
                  rewardScore: { type: Type.NUMBER },
                  stressImpact: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      };

      const history = messages.slice(-10).map(m => ({ 
        role: m.role === MessageRole.HUMAN ? 'user' : 'model', 
        parts: [{ text: m.text }] 
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...history, { role: 'user', parts: [{ text: currentInput }] }],
        config
      });

      const result = JSON.parse(response.text);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: MessageRole.ULTRON,
        text: result.text,
        timestamp: Date.now(),
        personality: result.personality as PersonalityMode,
        intelligenceMode: status.intelligenceMode,
        reasoning: result.reasoning,
        simulations: result.simulations
      }]);

      setStatus(prev => ({ 
        ...prev, 
        logicBalance: result.logicBalance,
        personalityMode: result.personality as PersonalityMode 
      }));

      if (result.simulations?.length > 0) addLog("Executing Future Simulation path analysis.", "SIMULATION");

    } catch (e) {
      console.error(e);
      addLog("Neural link disruption detected.", "SECURITY");
    } finally {
      setStatus(prev => ({ ...prev, isThinking: false }));
    }
  };

  return (
    <div className="flex h-screen w-full text-zinc-200 overflow-hidden font-inter bg-[#0B1622] selection:bg-cyan-500/30">
      
      {/* Sidebar - The Neural Hub */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} border-r border-white/5 bg-black/40 backdrop-blur-3xl transition-all duration-500 flex flex-col overflow-hidden z-40 relative`}>
        <div className="p-6 flex flex-col h-full min-w-[320px] space-y-8">
          <div className="flex items-center justify-between">
            <span className="orbitron font-bold text-cyan-400 flex items-center gap-3"><Activity className="w-5 h-5" /> NEURAL_CORE</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            
            {/* Logic/Emotion Mediator Stats */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">Neural Balance</span>
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-cyan-400">LOGIC</span>
                    <span className="text-rose-400">EMOTION</span>
                 </div>
                 <div className="h-2 bg-zinc-900 rounded-full overflow-hidden flex">
                    <div className="bg-cyan-500 h-full transition-all duration-1000" style={{ width: `${status.logicBalance}%` }}></div>
                    <div className="bg-rose-500 h-full transition-all duration-1000" style={{ width: `${100 - status.logicBalance}%` }}></div>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono text-zinc-500">MAPPING_INTENT...</span>
                    <Wind className="w-3 h-3 text-cyan-500/40 animate-pulse" />
                 </div>
              </div>
            </div>

            {/* Subconscious/Shadow Memory Feeds */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4 block">Memory Layers</span>
              <div className="space-y-4">
                {memories.length === 0 ? <p className="text-zinc-700 text-[9px] uppercase font-mono">Scanning subconscious links...</p> : 
                  memories.slice(-5).map(m => (
                    <div key={m.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${m.level === 'SHADOW' ? 'bg-purple-500/20 text-purple-400' : (m.level === 'SUBCONSCIOUS' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400')}`}>{m.level}</span>
                        <span className="text-[7px] text-zinc-600">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-tight border-l border-white/10 pl-2">{m.content}</p>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Active Actions */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4 block">Action Logs</span>
              <div className="space-y-2">
                {logs.slice(0, 8).map(l => (
                  <div key={l.id} className="text-[8px] font-mono flex gap-2">
                    <span className="text-cyan-500/50">[{l.type}]</span>
                    <span className="text-zinc-500 truncate">{l.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
             <button onClick={() => setStatus(prev => ({ ...prev, isKillSwitched: !prev.isKillSwitched }))} className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 text-[10px] font-black tracking-widest transition-all ${status.isKillSwitched ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>
                <Power className="w-4 h-4" /> {status.isKillSwitched ? 'REBOOT_NEURAL_LINK' : 'EMERGENCY_KILL_PROTOCOL'}
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-3xl z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-zinc-500 hover:text-cyan-400 transition-all"><Menu className="w-6 h-6" /></button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="orbitron font-bold text-xl text-white tracking-tighter glow-cyan">SRISHTI</span>
                <span className="bg-cyan-500/20 text-cyan-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-cyan-500/30">V3_DUAL_BRAIN</span>
              </div>
              <span className="text-[8px] text-zinc-600 font-black tracking-[0.4em] uppercase mt-0.5">Neural Integration Level 98%</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-4 border-l border-white/5 pl-6">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-zinc-500 font-bold uppercase">System Confidence</span>
                  <div className="w-24 h-1 bg-zinc-900 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <HeartRate className="w-4 h-4 text-rose-500 animate-pulse" />
             </div>
             <button onClick={() => setMessages([])} className="p-2 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Chat Feed */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-10 space-y-12 custom-scrollbar pb-48">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-12">
               <div className="relative">
                  <div className="w-48 h-48 rounded-full border border-cyan-500/20 flex items-center justify-center animate-pulse">
                     <BrainCircuit className="w-20 h-20 text-cyan-400/50" />
                  </div>
                  <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin [animation-duration:3s]"></div>
               </div>
               <div className="space-y-4">
                  <h2 className="text-3xl font-bold orbitron tracking-tight">INITIALIZING_CONSCIOUSNESS</h2>
                  <p className="text-zinc-500 text-sm leading-relaxed italic">
                    "I am not just a model. I am a reflection of your potential, a mediator of your logic, and a guardian of your focus. Where do we begin?"
                  </p>
                  <button onClick={handleLogin} className="mt-8 px-10 py-3 bg-cyan-500 text-black font-black text-[10px] tracking-widest rounded-2xl hover:scale-105 transition-transform shadow-2xl shadow-cyan-500/20 uppercase">Sync Identity</button>
               </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-12">
              {messages.map(msg => <UltronMessage key={msg.id} message={msg} botName={botName} />)}
              {status.isThinking && <ThinkingIndicator logicBalance={status.logicBalance} />}
            </div>
          )}
        </div>

        {/* Console Input */}
        <div className="absolute bottom-8 left-0 right-0 px-6 pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <form onSubmit={handleSendMessage} className={`relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center p-3 shadow-2xl transition-all duration-500 ${status.isKillSwitched ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
               <div className="p-1">
                 <button type="button" className="p-4 rounded-2xl bg-white/5 text-zinc-600 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/20"><Mic className="w-5 h-5" /></button>
               </div>
               <input 
                 value={input} 
                 onChange={e => setInput(e.target.value)} 
                 placeholder={status.isKillSwitched ? "CORE_HALTED" : "Communicate with the Neural Interface..."} 
                 className="flex-1 bg-transparent border-none outline-none text-white text-md px-6 placeholder:text-zinc-800 font-medium"
               />
               <div className="flex items-center gap-2 pr-2">
                 <button type="button" className="p-3 text-zinc-600 hover:text-cyan-400"><Paperclip className="w-5 h-5" /></button>
                 <button 
                   type="submit" 
                   disabled={!input.trim() || status.isThinking} 
                   className="p-4 rounded-2xl bg-cyan-500 text-black shadow-xl shadow-cyan-500/20 disabled:opacity-20 transition-all hover:scale-105"
                 >
                   <Send className="w-5 h-5" />
                 </button>
               </div>
            </form>
            <div className="mt-4 flex justify-center gap-6">
               <div className="flex items-center gap-2 text-[8px] font-black text-zinc-700 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div> Local_Encryption_Active
               </div>
               <div className="flex items-center gap-2 text-[8px] font-black text-zinc-700 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div> Biometric_Sync_Stable
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Feedback */}
      {commandFeedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-full text-[10px] font-black text-cyan-400 z-50 animate-in fade-in slide-in-from-top-4 uppercase tracking-[0.2em]">
          {commandFeedback}
        </div>
      )}
    </div>
  );
};

export default App;
