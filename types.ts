
export enum MessageRole {
  ULTRON = 'ultron',
  HUMAN = 'human',
  SYSTEM = 'system'
}

export type MemoryLevel = 'CONSCIOUS' | 'SUBCONSCIOUS' | 'REFLECTION' | 'SHADOW';

export interface MemoryItem {
  id: string;
  content: string;
  level: MemoryLevel;
  timestamp: number;
  sentiment?: number; // -1 to 1
  impact?: number; // 0 to 10
}

export interface SimulationPath {
  label: string;
  description: string;
  riskScore: number; // 0-100
  rewardScore: number; // 0-100
  stressImpact: number; // 0-100
  recommendation: string;
}

export interface ReasoningTrace {
  logicalPath: string;
  emotionalContext: string;
  mediatorConclusion: string;
}

export type IntelligenceMode = 'ASI' | 'GROK' | 'QWEN' | 'PERPLEXITY' | 'DUAL_BRAIN';

export type PersonalityMode = 'MENTOR' | 'COMMANDER' | 'THERAPIST' | 'HACKER' | 'ULTRON';

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
  imageUrl?: string;
  videoUrl?: string;
  isThinking?: boolean;
  personality?: PersonalityMode;
  intelligenceMode?: IntelligenceMode;
  reasoning?: ReasoningTrace;
  simulations?: SimulationPath[];
}

export interface SessionState {
  isActive: boolean;
  isThinking: boolean;
  intelligenceMode: IntelligenceMode;
  personalityMode: PersonalityMode;
  logicBalance: number; // 0 to 100 (0=Pure Emotion, 100=Pure Logic)
  systemHealth: number;
  isAutoLearning: boolean;
  isWhisperMode: boolean;
  isCanvasActive: boolean;
  isKillSwitched: boolean;
}

export interface Alarm {
  id: string;
  time: string;
  label: string;
  active: boolean;
}

export interface Reminder {
  id: string;
  text: string;
  time: string;
}

export interface RelayLog {
  id: string;
  type: 'SYSTEM' | 'LEARNING' | 'ACTION' | 'SIMULATION' | 'AUDIT' | 'SECURITY';
  content: string;
  timestamp: number;
}
