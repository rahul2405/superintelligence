
import React, { useState } from 'react';
import { Message, MessageRole, PersonalityMode, IntelligenceMode } from '../types';
import { User, Bot, Zap, Cpu, TrendingUp, ShieldAlert, Binary, Sparkle, Microscope, Info, ChevronDown, ChevronUp, AlertCircle, BarChart, Target } from 'lucide-react';

interface Props {
  message: Message;
  botName?: string;
}

const UltronMessage: React.FC<Props> = ({ message, botName = 'Srishti' }) => {
  const isSrishti = message.role === MessageRole.ULTRON;
  const [showReasoning, setShowReasoning] = useState(false);

  const getStyles = () => {
    if (!isSrishti) return "bg-white/5 border-zinc-800 text-zinc-300";
    
    switch (message.personality) {
      case 'COMMANDER': return "border-red-500/40 bg-red-950/10 text-red-50 shadow-[0_0_40px_rgba(239,68,68,0.1)]";
      case 'THERAPIST': return "border-rose-400/40 bg-rose-950/10 text-rose-50 shadow-[0_0_40px_rgba(244,63,94,0.1)]";
      case 'MENTOR': return "border-emerald-500/40 bg-emerald-950/10 text-emerald-50 shadow-[0_0_40px_rgba(16,185,129,0.1)]";
      case 'HACKER': return "border-cyan-400/40 bg-cyan-950/10 text-cyan-50 font-mono shadow-[0_0_40px_rgba(6,182,212,0.1)]";
      default: return "border-cyan-500/30 bg-[#152130]/80 text-white shadow-[0_0_30px_rgba(0,194,255,0.05)]";
    }
  };

  const getIcon = () => {
    if (!isSrishti) return <User className="w-4 h-4 text-zinc-500" />;
    switch (message.personality) {
      case 'COMMANDER': return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'THERAPIST': return <Sparkle className="w-4 h-4 text-rose-400" />;
      case 'MENTOR': return <Target className="w-4 h-4 text-emerald-400" />;
      case 'HACKER': return <Binary className="w-4 h-4 text-cyan-400" />;
      default: return <Bot className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className={`flex w-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isSrishti ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-700 ${
        isSrishti 
          ? 'bg-black/40 border-cyan-500/30 text-cyan-400 shadow-xl'
          : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
      }`}>
        {isSrishti ? getIcon() : <User className="w-6 h-6" />}
      </div>

      <div className={`flex flex-col max-w-[85%] ${isSrishti ? 'items-start' : 'items-end'}`}>
        <div className={`text-[9px] uppercase tracking-[0.2em] mb-2 font-black flex items-center gap-2 ${isSrishti ? 'text-zinc-500' : 'text-zinc-600'}`}>
          {isSrishti ? `${botName.toUpperCase()} // ${message.personality || 'DUAL_BRAIN'}` : 'USER_IDENTITY'}
          {getIcon()}
        </div>
        
        <div className={`flex flex-col gap-4 p-6 rounded-[2.5rem] text-[16px] leading-relaxed border backdrop-blur-3xl shadow-2xl relative group ${getStyles()} ${isSrishti ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
          <p className="whitespace-pre-wrap font-medium">
            {message.text}
          </p>

          {/* Reasoning Trace Toggle */}
          {message.reasoning && (
            <div className="mt-2 border-t border-white/5 pt-4">
              <button 
                onClick={() => setShowReasoning(!showReasoning)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors"
              >
                {showReasoning ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Explain Reasoning
              </button>
              {showReasoning && (
                <div className="mt-4 space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5 animate-in slide-in-from-top-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-cyan-500/60 uppercase">Logical_Path</span>
                    <span className="text-xs text-zinc-400">{message.reasoning.logicalPath}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-rose-500/60 uppercase">Emotional_Context</span>
                    <span className="text-xs text-zinc-400">{message.reasoning.emotionalContext}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Future Simulations */}
          {message.simulations && message.simulations.length > 0 && (
            <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/80 flex items-center gap-2">
                <BarChart className="w-3 h-3" /> Predicted_Futures (ASI_Lite)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {message.simulations.map((sim, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-amber-500/30 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-white uppercase">{sim.label}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[8px] uppercase font-black tracking-widest text-zinc-500">
                        <span>Risk</span> <span>Reward</span>
                      </div>
                      <div className="h-1 bg-zinc-800 rounded-full flex overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: `${sim.riskScore}%` }}></div>
                        <div className="h-full bg-emerald-500" style={{ width: `${sim.rewardScore}%` }}></div>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-tight italic">{sim.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="text-[10px] text-zinc-800 mt-3 font-black tracking-[0.3em] px-3">
           {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default UltronMessage;
