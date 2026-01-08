
import React from 'react';
import { BrainCircuit, Cpu, Heart, Activity } from 'lucide-react';

interface Props {
  logicBalance?: number;
}

const ThinkingIndicator: React.FC<Props> = ({ logicBalance = 50 }) => {
  return (
    <div className="flex w-full gap-5 opacity-90 animate-in fade-in slide-in-from-left-4 duration-500 mb-8">
      <div className="flex-shrink-0 w-12 h-12 relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping"></div>
        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-black/40 backdrop-blur-xl transition-colors duration-1000 ${logicBalance > 50 ? 'border-cyan-500' : 'border-rose-500'}`}>
           <BrainCircuit className={`w-6 h-6 ${logicBalance > 50 ? 'text-cyan-400' : 'text-rose-400'} animate-pulse`} />
        </div>
      </div>

      <div className="flex flex-col items-start w-full max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-black tracking-widest text-cyan-500/80 uppercase">Mediator_Active</span>
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
               <div className="h-full bg-cyan-400 transition-all duration-1000" style={{ width: `${logicBalance}%` }}></div>
            </div>
            <Heart className="w-3 h-3 text-rose-400" />
            <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
               <div className="h-full bg-rose-400 transition-all duration-1000" style={{ width: `${100 - logicBalance}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="w-full p-4 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl flex items-center gap-4">
          <Activity className="w-4 h-4 text-cyan-500/40 animate-pulse" />
          <div className="flex flex-col">
             <span className="text-[10px] uppercase font-black text-cyan-400/70 tracking-tighter">
               {logicBalance > 70 ? 'Synthesizing Tactical Solution...' : (logicBalance < 30 ? 'Analyzing Emotional Impact...' : 'Balancing Neural Outcomes...')}
             </span>
             <div className="flex gap-1 mt-1">
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
