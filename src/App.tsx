import React, { useState, useMemo, ChangeEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Sparkles, 
  User, 
  Search,
  TrendingUp,
  Heart,
  ChevronRight,
  Play,
  Volume2,
  Download,
  AlertCircle,
  Zap,
  Mic,
  Activity,
  Layers,
  Home,
  Layout,
  Plus,
  Compass,
  Scissors,
  Text,
  Palette,
  Timer,
  Ghost,
  Camera,
  Settings,
  MoreVertical,
  Pause,
  SkipForward,
  SkipBack,
  ArrowLeft,
  Undo2,
  Redo2,
  Trash2,
  Copy,
  Upload,
  Clapperboard,
  Type,
  AudioLines,
  Smile,
  SlidersHorizontal,
  MoveUpRight,
  BookOpen,
  Smartphone,
  Monitor,
  Square,
  Check,
  ZapOff,
  Minimize2,
  Maximize2,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
  Target,
  Diamond,
  Magnet,
  IterationCcw,
  RefreshCw,
  Repeat,
  Eye,
  EyeOff,
  BoxSelect,
  ArrowLeftRight,
  MoveHorizontal
} from 'lucide-react';
import { SOUNDS, PRESETS, TUTORIALS, EFFECTS, PRESET_PACKS, type Sound, type Preset, type Tutorial, type Effect, type PresetPack } from './data/mock';
import { useFavorites } from './hooks/useFavorites';
import { generateCaptions } from './lib/gemini';

// --- TYPES ---
type Tab = 'home' | 'templates' | 'create' | 'discover' | 'profile';

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [prevTab, setPrevTab] = useState<Tab>('home');
  const [showQuickActions, setShowQuickActions] = useState(false);

  // User Profile State
  const [userName, setUserName] = useState('Vortex Edits');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Global Editor State to allow "Using" effects from anywhere
  const [activeToolPanel, setActiveToolPanel] = useState<string | null>(null);
  const [selectedEffectId, setSelectedEffectId] = useState<string | null>(null);
  const [effectParams, setEffectParams] = useState<Record<string, number>>({});
  const [effectCategory, setEffectCategory] = useState<string>('All');
  
  // Professional Adjustment States
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0,
    tint: 0,
    highlights: 0,
    shadows: 0,
    sharpen: 0,
    vignette: 0,
  });

  const [projectSettings, setProjectSettings] = useState({
    resolution: '1080p',
    fps: 30,
    ratio: '9:16',
  });

  const [audioSettings, setAudioSettings] = useState({
    musicVol: 25,
    voiceVol: 100,
    noiseReduction: false,
  });

  const [showProTips, setShowProTips] = useState(false);

  // Tutorial Progress State
  const [tutorialProgress, setTutorialProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('vortex_tutorial_progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('vortex_tutorial_progress', JSON.stringify(tutorialProgress));
  }, [tutorialProgress]);

  const completeTutorialStep = (id: string, totalSteps: number) => {
    setTutorialProgress(prev => {
      const current = prev[id] || 0;
      if (current >= totalSteps) return prev;
      return { ...prev, [id]: current + 1 };
    });
    if ((tutorialProgress[id] || 0) + 1 === totalSteps) {
      showToast('Masterclass Completed! 🎓');
    }
  };

  const applyEffect = (effectId: string) => {
    setSelectedEffectId(effectId);
    setActiveToolPanel('Effects');
    const effect = EFFECTS.find(e => e.id === effectId);
    if (effect?.parameters) {
      const initialParams: Record<string, number> = {};
      effect.parameters.forEach(p => initialParams[p.label] = p.defaultValue);
      setEffectParams(initialParams);
    }
    setActiveTab('create');
  };

  const goToTab = (tab: Tab) => {
    if (activeTab !== 'create') {
      setPrevTab(activeTab);
    }
    setActiveTab(tab);
  };

  const { favorites: favSounds, toggleFavorite: toggleFavSound, isFavorite: isFavSound } = useFavorites<Sound>('editpro_sounds');
  const { favorites: favPresets, toggleFavorite: toggleFavPreset, isFavorite: isFavPreset } = useFavorites<Preset>('editpro_presets');

  const [toast, setToast] = useState<string | null>(null);
  const [playingSoundId, setPlayingSoundId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const playSound = (sound: Sound) => {
    if (playingSoundId === sound.id) {
      audioRef.current?.pause();
      setPlayingSoundId(null);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(sound.url);
      } else {
        audioRef.current.src = sound.url;
      }
      audioRef.current.play();
      setPlayingSoundId(sound.id);
      audioRef.current.onended = () => setPlayingSoundId(null);
    }
  };

  const downloadSound = async (sound: Sound) => {
    try {
      showToast('Starting download...');
      const response = await fetch(sound.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sound.title} - ${sound.artist}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Download complete');
    } catch (error) {
      showToast('Download failed');
      console.error(error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  const currentSound = useMemo(() => 
    SOUNDS.find(s => s.id === playingSoundId), 
    [playingSoundId]
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return (
        <HomeView 
          setActiveTab={goToTab} 
          toggleFavSound={toggleFavSound} 
          isFavSound={isFavSound} 
          showToast={showToast} 
          playSound={playSound}
          playingSoundId={playingSoundId}
          downloadSound={downloadSound}
          applyEffect={applyEffect}
        />
      );
      case 'templates': return <TemplatesView toggleFavPreset={toggleFavPreset} isFavPreset={isFavPreset} copyToClipboard={copyToClipboard} />;
      case 'create': return (
        <EditorView 
          onBack={() => setActiveTab(prevTab)} 
          copyToClipboard={copyToClipboard} 
          showToast={showToast}
          activeToolPanel={activeToolPanel}
          setActiveToolPanel={setActiveToolPanel}
          selectedEffectId={selectedEffectId}
          setSelectedEffectId={setSelectedEffectId}
          effectParams={effectParams}
          setEffectParams={setEffectParams}
          effectCategory={effectCategory}
          setEffectCategory={setEffectCategory}
          adjustments={adjustments}
          setAdjustments={setAdjustments}
          projectSettings={projectSettings}
          setProjectSettings={setProjectSettings}
          audioSettings={audioSettings}
          setAudioSettings={setAudioSettings}
          showProTips={showProTips}
          setShowProTips={setShowProTips}
        />
      );
      case 'discover': return <DiscoverView applyEffect={applyEffect} tutorialProgress={tutorialProgress} completeTutorialStep={completeTutorialStep} />;
      case 'profile': return (
        <ProfileView 
          favSounds={favSounds} 
          favPresets={favPresets} 
          playSound={playSound}
          playingSoundId={playingSoundId}
          downloadSound={downloadSound}
          userName={userName}
          setUserName={setUserName}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-[#F8F9FA] flex flex-col font-sans selection:bg-primary/30">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] glass px-8 py-4 rounded-3xl font-bold text-xs shadow-[0_20px_50px_rgba(0,0,0,0.5)] tracking-widest uppercase border border-white/10 flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-2xl mx-auto w-full flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="pb-32 min-h-screen"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Mini Player */}
      <AnimatePresence>
        {currentSound && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-28 left-4 right-4 z-50 glass-morphism rounded-3xl p-3 flex items-center gap-4 border-primary/20 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 relative">
               <img src={currentSound.thumbnail} className="w-full h-full object-cover" alt="" />
               <div className="absolute inset-0 bg-primary/20 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-bold truncate text-white">{currentSound.title}</p>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{currentSound.artist}</p>
            </div>
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => downloadSound(currentSound)}
                 className="p-3 text-white/40 hover:text-white transition-colors"
               >
                 <Download className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => playSound(currentSound)}
                 className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-xl active:scale-95 transition-all"
               >
                 <Pause className="w-5 h-5 fill-current" />
               </button>
               <button 
                 onClick={() => {
                   audioRef.current?.pause();
                   setPlayingSoundId(null);
                 }}
                 className="p-3 text-white/20 hover:text-red-500 transition-colors"
               >
                 <Plus className="w-4 h-4 rotate-45" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-[60] glass border-t border-white/5 bg-[#0F0F0F]/90 backdrop-blur-3xl pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-between h-24 px-4 relative">
          <NavButton icon={Home} label="Home" active={activeTab === 'home'} onClick={() => goToTab('home')} />
          <NavButton icon={Layout} label="Library" active={activeTab === 'templates'} onClick={() => goToTab('templates')} />
          
          {/* Main Create Link */}
          <div className="relative -top-10 flex flex-col items-center">
            <motion.button 
              onClick={() => setShowQuickActions(true)}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={`group relative px-6 h-14 rounded-full flex items-center gap-3 transition-all shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)] active:scale-95 ${
                activeTab === 'create' 
                  ? 'bg-primary text-white shadow-primary/40' 
                  : 'bg-white text-black shadow-white/20'
              }`}
            >
              {/* Outer Glow Pulse */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-primary/40 -z-20 blur-2xl"
              />
              
              <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center">
                <Plus className={`w-5 h-5 transition-all duration-500 ${activeTab === 'create' ? 'rotate-45' : ''}`} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Start Editing</span>
            </motion.button>
          </div>

          <NavButton icon={Compass} label="Discover" active={activeTab === 'discover'} onClick={() => goToTab('discover')} />
          <NavButton icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => goToTab('profile')} />
        </div>
      </nav>

      {/* Quick Actions Modal */}
      <AnimatePresence>
        {showQuickActions && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowQuickActions(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]" 
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[80] glass-morphism rounded-t-[48px] p-8 pb-16 border-t border-white/10"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-10" />
              <div className="grid grid-cols-2 gap-4">
                 <button 
                  onClick={() => { setShowQuickActions(false); goToTab('create'); }}
                  className="glass flex flex-col items-center gap-4 p-8 rounded-[36px] group hover:border-primary/50 transition-all relative overflow-hidden"
                 >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                       <Zap className="w-8 h-8 fill-current" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest relative z-10">Auto Edit</span>
                 </button>
                 <button 
                  onClick={() => { setShowQuickActions(false); goToTab('templates'); }}
                  className="glass flex flex-col items-center gap-4 p-8 rounded-[36px] group hover:border-secondary/50 transition-all relative overflow-hidden"
                 >
                    <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                       <Layout className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest relative z-10">Templates</span>
                 </button>
                 <button 
                  onClick={() => { setShowQuickActions(false); goToTab('create'); }}
                  className="glass flex items-center justify-center gap-4 p-8 rounded-[36px] group col-span-2 hover:bg-white/5 transition-all"
                 >
                    <div className="w-12 h-12 glass rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Import Video</span>
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-2 flex-1 transition-all duration-300 relative group ${active ? 'text-primary' : 'text-white/20 hover:text-white'}`}
    >
      <div className={`p-2 rounded-2xl transition-all duration-500 ${active ? 'scale-110 shadow-[0_0_20px_rgba(108,92,231,0.2)]' : 'group-hover:scale-105'}`}>
        <Icon className={`w-6 h-6 transition-all duration-300 ${active ? 'fill-primary/20' : ''}`} />
      </div>
      <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all ${active ? 'opacity-100 translate-y-0.5' : 'opacity-60'}`}>{label}</span>
      
      {active && (
        <motion.div 
          layoutId="nav-pill" 
          className="absolute -bottom-8 w-1.5 h-1.5 bg-primary rounded-full glow-primary" 
        />
      )}
    </button>
  );
}

// --- VIEWS ---

function HomeView({ 
  setActiveTab, 
  toggleFavSound, 
  isFavSound, 
  showToast,
  playSound,
  playingSoundId,
  downloadSound,
  applyEffect
}: { 
  setActiveTab: (t: Tab) => void, 
  toggleFavSound: (s: Sound) => void, 
  isFavSound: (id: string) => boolean, 
  showToast: (m: string) => void,
  playSound: (s: Sound) => void,
  playingSoundId: string | null,
  downloadSound: (s: Sound) => void,
  applyEffect: (id: string) => void
}) {
  const trendingPresets = PRESETS.filter(p => p.isTrending);

  return (
    <div className="p-6 space-y-12">
      {/* Header & Primary Action */}
      <header className="space-y-8 pt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-white mb-1">Editor Pro</h2>
            <p className="text-white/40 text-sm font-medium">Create your next masterpiece</p>
          </div>
          <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center relative group">
             <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-4 border-dark-bg" />
             <Settings className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* PRIMARY HERO ACTION */}
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('create')}
          className="w-full h-44 glass-morphism rounded-[32px] p-8 text-left relative overflow-hidden group shadow-[0_30px_60px_rgba(108,92,231,0.2)] border-primary/20"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                 <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center mb-4 glow-secondary">
                    <Plus className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-display font-black tracking-tight">Start Editing</h3>
                 <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">New Project</p>
              </div>
              <div className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest">
                 <span>Ready to sync</span>
                 <ChevronRight className="w-3 h-3" />
              </div>
           </div>
           {/* Decorative floating icons */}
           <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-10 right-20 opacity-20"><Camera className="w-8 h-8" /></motion.div>
           <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute top-10 right-10 opacity-10"><Music className="w-12 h-12" /></motion.div>
        </motion.button>
      </header>

      {/* Quick Tools */}
      <section className="grid grid-cols-2 gap-4">
        <QuickToolCard 
          icon={Zap} 
          title="Auto Edit" 
          desc="1-Tap Magic" 
          color="bg-primary/20 text-primary border-primary/10" 
          onClick={() => setActiveTab('create')}
          delay={0.1}
        />
        <QuickToolCard 
          icon={Music} 
          title="Beat Sync" 
          desc="Audio Match" 
          color="bg-secondary/20 text-secondary border-secondary/10" 
          onClick={() => setActiveTab('create')}
          delay={0.2}
        />
      </section>

      {/* Featured Artists */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Featured Creators</h3>
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar -mx-6 px-6">
           {['Alex Rivera', 'Sarah Chen', 'Marco Ross', 'Lila Sun'].map((name, i) => (
             <div key={name} className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary/40 to-secondary/40 group-hover:from-primary group-hover:to-secondary transition-all">
                   <div className="w-full h-full rounded-full overflow-hidden border-2 border-dark-bg">
                      <img src={`https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80&i=${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                   </div>
                </div>
                <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors">{name}</span>
             </div>
           ))}
        </div>
      </section>

      {/* Trending Templates */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Trending Templates</h3>
          <button onClick={() => setActiveTab('templates')} className="text-[10px] font-black text-primary uppercase tracking-widest py-1 px-4 glass rounded-full">Explore</button>
        </div>
        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-6 -mx-6 px-6">
          {trendingPresets.map((preset, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              whileHover={{ y: -8 }}
              key={preset.id} 
              className="flex-shrink-0 w-64 aspect-[3/4] relative rounded-[40px] overflow-hidden glass-morphism group cursor-pointer border-white/5"
            >
              <img src={preset.previewUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-60 group-hover:opacity-100" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 space-y-3">
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 glass rounded-lg flex items-center justify-center">
                     <TrendingUp className="w-3 h-3 text-secondary" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Hot Trend</span>
                 </div>
                 <h4 className="font-display font-bold text-xl leading-none">{preset.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Sounds */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Hype Audio</h3>
        </div>
        <div className="grid gap-4">
          {SOUNDS.map((sound, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (idx * 0.1) }}
              key={sound.id} 
              className="glass p-4 rounded-[32px] flex items-center gap-5 group hover:bg-white/[0.08] transition-all border-white/5"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0">
                <img src={sound.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => playSound(sound)}
                    className="w-10 h-10 glass rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                  >
                    {playingSoundId === sound.id ? (
                       <div className="flex gap-1 items-end h-3">
                          <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white" />
                          <motion.div animate={{ height: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white" />
                          <motion.div animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white" />
                       </div>
                    ) : (
                       <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base truncate mb-1">{sound.title}</h4>
                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest leading-none">{sound.artist} • {sound.duration}</p>
              </div>
              <div className="flex items-center gap-2 pr-2">
                <button 
                  onClick={() => downloadSound(sound)}
                  className="p-4 rounded-full text-white/20 hover:text-white/60 hover:bg-white/5 transition-all active:scale-90"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => toggleFavSound(sound)}
                  className={`p-4 rounded-full transition-all active:scale-90 ${isFavSound(sound.id) ? 'text-red-500 bg-red-500/10' : 'text-white/20 hover:text-white/40 hover:bg-white/5'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavSound(sound.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function QuickToolCard({ icon: Icon, title, desc, color, onClick, delay }: { icon: any, title: string, desc: string, color: string, onClick: () => void, delay: number }) {
  return (
    <motion.button 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${color} glass rounded-[28px] p-6 text-left relative overflow-hidden group border h-32`}
    >
      <Icon className="w-6 h-6 mb-4" />
      <h3 className="font-bold text-sm leading-none mb-1">{title}</h3>
      <p className="opacity-40 text-[9px] font-black uppercase tracking-widest">{desc}</p>
    </motion.button>
  );
}

function TemplatesView({ toggleFavPreset, isFavPreset, copyToClipboard }: { toggleFavPreset: (p: Preset) => void, isFavPreset: (id: string) => boolean, copyToClipboard: (t: string) => void }) {
  const [activeCat, setActiveCat] = useState('All');
  const cats = ['All', 'Viral', 'Slow-mo', 'Sad', 'Hype', 'Cinematic'];

  return (
    <div className="p-6 space-y-10">
      <header className="pt-10 space-y-8">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-3xl font-display font-extrabold tracking-tight">Library</h2>
          <Layout className="w-6 h-6 text-primary glow-primary" />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
          {cats.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeCat === cat ? 'bg-primary border-primary text-white shadow-xl glow-primary' : 'bg-white/[0.03] border-white/5 text-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-5">
        {PRESETS.map((preset, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5 }}
            key={preset.id} 
            className="aspect-[9/14] glass-morphism rounded-[32px] overflow-hidden relative group border-white/5"
          >
            <img src={preset.previewUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-70 group-hover:opacity-100" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
            
            <button 
              onClick={() => toggleFavPreset(preset)}
              className="absolute top-4 right-4 z-10 w-10 h-10 glass rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90"
            >
               <Heart className={`w-4 h-4 ${isFavPreset(preset.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>

            <div className="absolute bottom-5 left-5 right-5">
               <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3 h-3 text-secondary" />
                  <p className="text-[8px] font-black text-secondary uppercase tracking-[0.2em]">{preset.vibe}</p>
               </div>
               <h4 className="font-bold text-sm leading-tight mb-4 truncate">{preset.name}</h4>
               <button 
                onClick={() => copyToClipboard(preset.steps.join('\n'))}
                className="w-full py-3 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-2xl"
               >
                 Use Model
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DiscoverView({ 
  applyEffect, 
  tutorialProgress, 
  completeTutorialStep 
}: { 
  applyEffect: (id: string) => void,
  tutorialProgress: Record<string, number>,
  completeTutorialStep: (id: string, total: number) => void
}) {
  const [activeEffectCat, setActiveEffectCat] = useState('All');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const effectCats = ['All', 'Motion', 'Glitch', 'Light', 'Blur'];

  const getProgress = (id: string, total: number) => {
    const steps = tutorialProgress[id] || 0;
    return (steps / total) * 100;
  };

  return (
    <div className="p-6 space-y-12">
      <header className="pt-10 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display font-extrabold tracking-tight">Discover</h2>
          <Compass className="w-6 h-6 text-secondary" />
        </div>
        
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-secondary transition-colors" />
          <input 
            type="text" 
            placeholder="Search trends, effects, or tutorials..."
            className="w-full glass rounded-3xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-secondary/50 transition-all placeholder:text-white/10"
          />
        </div>
      </header>

      {/* HERO MASTERCLASS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Featured Masterclass</h3>
          <Zap className="w-4 h-4 text-secondary animate-pulse" />
        </div>
        <motion.div 
          whileHover={{ y: -5 }}
          className="relative h-72 rounded-[40px] overflow-hidden group shadow-2xl border border-white/5"
        >
          <img src={TUTORIALS[0].thumbnail} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-[2s]" alt="" />
          <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 glass rounded-full text-[9px] font-black uppercase tracking-widest text-secondary">{TUTORIALS[0].difficulty}</span>
                  <span className="px-3 py-1 glass rounded-full text-[9px] font-black uppercase tracking-widest text-white/60">{TUTORIALS[0].duration}</span>
                </div>
                {tutorialProgress[TUTORIALS[0].id] === TUTORIALS[0].steps.length && (
                  <div className="flex items-center gap-2 text-green-400">
                    <Check className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Completed</span>
                  </div>
                )}
             </div>
             
             <h4 className="text-3xl font-display font-black tracking-tight mb-6">{TUTORIALS[0].title}</h4>
             
             <div className="space-y-4">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${getProgress(TUTORIALS[0].id, TUTORIALS[0].steps.length)}%` }}
                     className="h-full bg-secondary shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                   />
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedTutorial(TUTORIALS[0])}
                    className="flex-1 bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                  >
                    {tutorialProgress[TUTORIALS[0].id] ? 'Continue Learning' : 'Start Masterclass'}
                  </button>
                  <button 
                    onClick={() => applyEffect('e1')}
                    className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-colors group"
                  >
                    <Play className="w-5 h-5 fill-current" />
                  </button>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* OTHER TUTORIALS */}
      <section className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 px-1">Trending Learn</h3>
        <div className="grid gap-4">
          {TUTORIALS.slice(1).map((tutorial) => {
            const isCompleted = (tutorialProgress[tutorial.id] || 0) === tutorial.steps.length;
            const currentStep = tutorialProgress[tutorial.id] || 0;
            
            return (
              <div 
                key={tutorial.id} 
                onClick={() => setSelectedTutorial(tutorial)}
                className="glass p-4 rounded-3xl flex gap-4 group cursor-pointer hover:bg-white/5 transition-all relative overflow-hidden"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/5 relative">
                  <img src={tutorial.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                  {isCompleted && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                       <div className="w-8 h-8 bg-white text-green-500 rounded-full flex items-center justify-center shadow-xl">
                          <Check className="w-5 h-5" />
                       </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center gap-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm group-hover:text-primary transition-colors pr-8">{tutorial.title}</h4>
                    {isCompleted && <span className="text-[8px] font-black uppercase tracking-[0.2em] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Pro</span>}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                       <div className="flex items-center gap-1.5">
                         <span>{tutorial.difficulty}</span>
                         <span className="w-1 h-1 bg-white/10 rounded-full" />
                         <span>{tutorial.duration}</span>
                       </div>
                       <span>{currentStep}/{tutorial.steps.length} Steps</span>
                    </div>
                    
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${getProgress(tutorial.id, tutorial.steps.length)}%` }}
                         className={`h-full ${isCompleted ? 'bg-green-400' : 'bg-primary'}`}
                       />
                    </div>
                  </div>
                </div>
                
                {/* Visual completion indicator on the card edge */}
                {isCompleted && (
                  <div className="absolute top-0 right-0 w-1 h-full bg-green-400/30" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* TUTORIAL MODAL */}
      <AnimatePresence>
        {selectedTutorial && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTutorial(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110]"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-[120] glass-morphism rounded-t-[48px] max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div className="sticky top-0 z-20 glass-morphism p-6 flex items-center justify-between border-b border-white/5">
                <button onClick={() => setSelectedTutorial(null)} className="w-10 h-10 glass rounded-full flex items-center justify-center">
                   <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="text-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Step-by-Step</p>
                   <h3 className="font-bold text-sm">{selectedTutorial.title}</h3>
                </div>
                <div className="w-10 h-10 flex items-center justify-center">
                   <BookOpen className="w-5 h-5 text-secondary" />
                </div>
              </div>

              <div className="p-8 space-y-10">
                 <div className="relative aspect-video rounded-[32px] overflow-hidden group">
                    <img src={selectedTutorial.thumbnail} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                       <button className="w-20 h-20 glass rounded-full flex items-center justify-center backdrop-blur-xl group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 fill-white ml-1.5" />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-6">
                    {selectedTutorial.steps.map((step, idx) => {
                      const isCompleted = (tutorialProgress[selectedTutorial.id] || 0) > idx;
                      const isCurrent = (tutorialProgress[selectedTutorial.id] || 0) === idx;
                      
                      return (
                        <div 
                          key={idx}
                          className={`p-6 rounded-[32px] border transition-all ${
                            isCompleted 
                              ? 'bg-green-500/5 border-green-500/20' 
                              : isCurrent 
                                ? 'bg-primary/5 border-primary/30' 
                                : 'bg-white/5 border-white/5 opacity-40'
                          }`}
                        >
                           <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                 <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                                   isCompleted ? 'bg-green-500 text-white' : 'bg-primary/20 text-primary'
                                 }`}>
                                    {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                                 </div>
                                 <h5 className={`font-bold uppercase tracking-widest text-[10px] ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                                    {step.title}
                                 </h5>
                              </div>
                              {isCompleted && <span className="text-[8px] font-black uppercase text-green-400/60 tracking-widest">Done</span>}
                           </div>
                           <p className="text-white/60 text-xs leading-relaxed">{step.content}</p>
                        </div>
                      );
                    })}
                 </div>

                 <div className="pt-6">
                    {(tutorialProgress[selectedTutorial.id] || 0) < selectedTutorial.steps.length ? (
                      <button 
                        onClick={() => completeTutorialStep(selectedTutorial.id, selectedTutorial.steps.length)}
                        className="w-full py-6 bg-primary text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_rgba(108,92,231,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                         <Zap className="w-4 h-4 fill-current" />
                         Complete Next Step
                      </button>
                    ) : (
                      <button 
                        onClick={() => { applyEffect('e2'); setSelectedTutorial(null); }}
                        className="w-full py-6 bg-white text-black rounded-[32px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                         <Sparkles className="w-4 h-4" />
                         Open in Editor
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setSelectedTutorial(null)}
                      className="w-full py-4 text-white/20 hover:text-white/40 text-[10px] font-black uppercase tracking-widest mt-4"
                    >
                       Done for now
                    </button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* EFFECTS LIBRARY */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Effects Library</h3>
          <div className="flex gap-2">
            {effectCats.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveEffectCat(cat)}
                className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${activeEffectCat === cat ? 'bg-primary text-white' : 'glass text-white/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-4">
          {EFFECTS.filter(e => activeEffectCat === 'All' || e.category === activeEffectCat).map(effect => (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => applyEffect(effect.id)}
              key={effect.id} 
              className="flex-shrink-0 w-36 space-y-4 group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden relative border border-white/5 shadow-xl">
                <img src={effect.previewUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                  <div className="w-8 h-8 glass rounded-xl flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
                {/* Loop animation indicator */}
                <div className="absolute top-3 right-3 flex gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-75" />
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse delay-150" />
                </div>
              </div>
              <div className="px-1">
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">{effect.category}</p>
                <h5 className="font-bold text-xs truncate group-hover:text-white group-hover:translate-x-1 transition-all">{effect.name}</h5>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function EditorView({ 
  onBack, 
  copyToClipboard, 
  showToast,
  activeToolPanel,
  setActiveToolPanel,
  selectedEffectId,
  setSelectedEffectId,
  effectParams,
  setEffectParams,
  effectCategory,
  setEffectCategory,
  adjustments,
  setAdjustments,
  projectSettings,
  setProjectSettings,
  audioSettings,
  setAudioSettings,
  showProTips,
  setShowProTips
}: { 
  onBack: () => void, 
  copyToClipboard: (t: string) => void, 
  showToast: (m: string) => void,
  activeToolPanel: string | null,
  setActiveToolPanel: (v: string | null) => void,
  selectedEffectId: string | null,
  setSelectedEffectId: (v: string | null) => void,
  effectParams: Record<string, number>,
  setEffectParams: React.Dispatch<React.SetStateAction<Record<string, number>>>,
  effectCategory: string,
  setEffectCategory: (v: string) => void,
  adjustments: any,
  setAdjustments: any,
  projectSettings: any,
  setProjectSettings: any,
  audioSettings: any,
  setAudioSettings: any,
  showProTips: boolean,
  setShowProTips: (v: boolean) => void
}) {
  const [activeMode, setActiveMode] = useState<'ai' | 'timeline'>('timeline');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [syncMatch, setSyncMatch] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<'trim' | 'blade' | 'slip' | 'ripple'>('trim');
  const [isSnapEnabled, setIsSnapEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [tracksLocked, setTracksLocked] = useState<string[]>([]);
  const [vibeMode, setVibeMode] = useState('Cinematic');
  
  const [timelineItems, setTimelineItems] = useState([
    { id: 'v1', type: 'video', color: 'bg-primary/40', label: 'Clip_01.mp4', track: 'video', start: '0%', width: '30%' },
    { id: 'v2', type: 'video', color: 'bg-primary/20', label: 'Clip_02.mp4', track: 'video', start: '30%', width: '45%' },
    { id: 't1', type: 'text', color: 'bg-neon-green/20', label: 'Title Text', track: 'text', start: '10%', width: '40%' },
    { id: 'e1', type: 'effect', color: 'bg-secondary/40', label: 'RGB Split', track: 'effects', start: '25%', width: '15%' },
    { id: 'a1', type: 'audio', color: 'bg-yellow-400/20', label: 'Hype_Beat.mp3', track: 'audio', start: '0%', width: '100%' },
  ]);

  const PRO_TIPS = [
    { title: 'Project Foundation', content: 'Resolution: 1080p, Frame Rate: 30fps/60fps. Aspect Ratio: 16:9 for YouTube, 9:16 for TikTok/Reels.' },
    { title: 'Timeline Workflow', content: 'Layers: Video -> Overlay -> Effects -> Text -> Audio. Messy timelines = amateur edits.' },
    { title: 'Cinematic Color', content: 'Brightness: -5 to -10, Contrast: +20, Saturation: +5. Add teal & orange for that film vibe.' },
    { title: 'Clean Sound', content: 'Music: 10-25%, Voice: 80-100%. Always add 0.5s fade in/out.' },
    { title: 'Speed & Rhythm', content: 'Transitions: 0.3-0.6s. Always cut on the beat for high engagement.' }
  ];

  const runAIAutoEdit = () => {
    setIsAIProcessing(true);
    setTimeout(() => {
      setTimelineItems(prev => prev.map(item => ({
        ...item,
        width: item.type === 'video' ? '30%' : item.width,
        start: item.id === 'v2' ? '30%' : item.start
      })));
      setIsAIProcessing(false);
      showToast('AI Pro Edit: Visuals perfectly synced to audio transients.');
    }, 2500);
  };

  const analyzeSync = () => {
    setSyncMatch(null);
    setTimeout(() => {
      setSyncMatch(Math.floor(Math.random() * 15) + 84); // 84-99%
    }, 1500);
  };

  const handleElementClick = (id: string) => {
    setSelectedElement(selectedElement === id ? null : id);
    setActiveToolPanel(null);
  };

  const getTools = () => {
    const selected = timelineItems.find(i => i.id === selectedElement);
    
    if (selected?.type === 'video') {
      return [
        { icon: Scissors, label: 'Split', action: 'panel' },
        { icon: Timer, label: 'Speed', action: 'panel' },
        { icon: Palette, label: 'Filters', action: 'panel' },
        { icon: SlidersHorizontal, label: 'Adjust', action: 'panel' },
        { icon: Trash2, label: 'Delete', action: 'delete' },
      ];
    }

    return [
      { icon: Sparkles, label: 'Magic', action: 'panel' },
      { icon: Palette, label: 'Adjust', action: 'panel' },
      { icon: AudioLines, label: 'Audio', action: 'panel' },
      { icon: Settings, label: 'Project', action: 'panel' },
      { icon: Type, label: 'Text', action: 'panel' },
      { icon: Ghost, label: 'Effects', action: 'panel' },
      { icon: Layers, label: 'Overlay', action: 'panel' },
      { icon: Timer, label: 'Speed', action: 'panel' },
    ];
  };

  const closePanel = () => {
    setActiveToolPanel(null);
    setSelectedEffectId(null);
    setEffectCategory('All');
    setEffectParams({});
  };

  const [magicState, setMagicState] = useState({ mood: 'Hype', style: 'Fast' });

  return (
    <div className="fixed inset-0 z-[100] bg-dark-bg flex flex-col font-sans overflow-hidden">
      {/* Top Bar - Pro Layout */}
      <div className="h-16 px-6 glass flex items-center justify-between border-b border-white/5 z-[60]">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
             <button className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer"><Undo2 className="w-4.5 h-4.5" /></button>
             <button className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer"><Redo2 className="w-4.5 h-4.5" /></button>
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          <h2 className="font-display font-black text-[10px] uppercase tracking-[0.2em] text-white/60">Project_Vortex_Studio</h2>
          <button 
            onClick={() => setActiveToolPanel('Project')}
            className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => {}}
             className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary group active:scale-95 transition-all"
           >
              <Play className="w-5 h-5 fill-current" />
           </button>
           <button 
            onClick={() => {
              setIsExporting(true);
              setTimeout(() => setIsExporting(false), 2000);
            }}
            className="bg-primary text-white px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            {isExporting ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {isExporting ? 'Rendered' : 'Export'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Preview Player & Keyframe Control Overlay */}
        <div className="flex-1 min-h-[35vh] p-6 flex flex-col items-center justify-center relative bg-[#050505]">
           {/* Center Preview Content */}
           <div 
             className="relative aspect-[9/16] h-[90%] bg-black rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,1)] border border-white/5 group"
             style={{ maxWidth: projectSettings.ratio === '16:9' ? '80%' : 'auto', aspectRatio: projectSettings.ratio.replace(':', '/') }}
           >
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-5 select-none font-black text-[4vw] uppercase tracking-[0.5em] text-white pointer-events-none">
                 Vortex Engine
              </div>
              
              {/* Playhead Time Overlay */}
              <div className="absolute top-6 left-6 z-10 px-4 py-2 glass-morphism rounded-xl border border-white/10 backdrop-blur-3xl">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[12px] font-mono font-bold tracking-widest text-white/90">00:04:12:08</span>
                 </div>
              </div>

              {/* Action Indicators (HUD style) */}
              <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2">
                 <div className="px-2 py-1 bg-primary/20 rounded-md border border-primary/30">
                    <span className="text-[8px] font-black text-primary uppercase">{vibeMode} View</span>
                 </div>
                 <div className="px-2 py-1 bg-white/5 rounded-md border border-white/10">
                    <span className="text-[8px] font-black text-white/40 uppercase">{projectSettings.resolution} / {projectSettings.fps}FPS</span>
                 </div>
              </div>
           </div>
           
           {/* Floating Floating HUD Controls (Pro CapCut vibe) */}
           <div className="absolute top-1/2 -translate-y-1/2 right-8 flex flex-col gap-4">
              <button onClick={() => setZoomLevel(p => Math.min(2, p+0.1))} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/20 hover:text-white transition-all"><ZoomIn className="w-5 h-5" /></button>
              <button onClick={() => setZoomLevel(p => Math.max(0.5, p-0.1))} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/20 hover:text-white transition-all"><ZoomOut className="w-5 h-5" /></button>
           </div>
           
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <button 
                onClick={() => showToast('Keyframe added at 00:04:12')}
                className="flex items-center gap-2 px-6 py-2.5 glass-morphism rounded-full border border-white/10 hover:border-primary/50 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-all group"
              >
                <Diamond className="w-3 h-3 group-hover:fill-current" />
                Add Keyframe
              </button>
           </div>
        </div>

        {/* PRO TIMELINE SECTION */}
        <div className="bg-[#0A0A0A] border-t border-white/10 flex flex-col min-h-[48vh] shadow-[0_-30px_100px_rgba(0,0,0,1)] relative z-40">
           
           {/* Timeline Context Bar (Tools & Snap) */}
           <div className="h-16 px-8 flex items-center justify-between border-b border-white/5 bg-black/40">
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
                 {[
                   { id: 'trim', icon: Scissors, label: 'Trim' },
                   { id: 'blade', icon: Scissors, label: 'Blade' },
                   { id: 'slip', icon: ArrowLeftRight, label: 'Slip' },
                   { id: 'ripple', icon: Repeat, label: 'Ripple' }
                 ].map(tool => (
                   <button 
                     key={tool.id}
                     onClick={() => setSelectedTool(tool.id as any)}
                     className={`px-4 h-10 rounded-xl flex items-center gap-2 transition-all ${selectedTool === tool.id ? 'bg-primary text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
                   >
                     <tool.icon className="w-4 h-4" />
                     <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">{tool.label}</span>
                   </button>
                 ))}
              </div>

              <div className="flex items-center gap-4">
                 <button 
                   onClick={() => setIsSnapEnabled(!isSnapEnabled)}
                   className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSnapEnabled ? 'bg-primary/20 text-primary border border-primary/30' : 'glass text-white/20'}`}
                 >
                    <Magnet className="w-4 h-4" />
                 </button>
                 <div className="h-6 w-[1px] bg-white/10" />
                 <button onClick={() => showToast('Frame Split')} className="px-6 py-2 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:bg-red-500 hover:text-white transition-all">Split</button>
              </div>
           </div>

           {/* MULTI-TRACK STACKED TIMELINE */}
           <div className="flex-1 overflow-x-auto no-scrollbar relative bg-[#0C0C0C]">
              {/* Playhead vertical line */}
              <div className="absolute top-0 bottom-0 left-[25%] w-0.5 bg-primary z-50 pointer-events-none shadow-[0_0_15px_rgba(108,92,231,0.8)]">
                  <div className="absolute -top-1 -left-2 w-4.5 h-7 bg-primary rounded-sm flex items-center justify-center">
                     <Target className="w-3 h-3 text-white" />
                  </div>
              </div>

              <div className="flex flex-col h-full min-w-[2000px] p-6 pt-12 space-y-2">
                 
                 {/* TRACK 1: TEXT / OVERLAYS */}
                 <TimelineTrack 
                    id="text" label="Layer 3" icon={Type} 
                    isLocked={tracksLocked.includes('text')}
                    onToggleLock={(id) => setTracksLocked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                 >
                    {timelineItems.filter(i => i.track === 'text').map(item => (
                       <TimelineClip key={item.id} item={item} selected={selectedElement === item.id} onClick={() => handleElementClick(item.id)} zoom={zoomLevel} />
                    ))}
                 </TimelineTrack>

                 {/* TRACK 2: EFFECTS */}
                 <TimelineTrack 
                    id="effects" label="Layer 2" icon={Ghost} 
                    isLocked={tracksLocked.includes('effects')}
                    onToggleLock={(id) => setTracksLocked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                 >
                    {timelineItems.filter(i => i.track === 'effects').map(item => (
                       <TimelineClip key={item.id} item={item} selected={selectedElement === item.id} onClick={() => handleElementClick(item.id)} zoom={zoomLevel} />
                    ))}
                 </TimelineTrack>

                 {/* TRACK 3: PRIMARY VIDEO */}
                 <TimelineTrack 
                    id="video" label="Layer 1" icon={Clapperboard} 
                    isLocked={tracksLocked.includes('video')}
                    active
                    onToggleLock={(id) => setTracksLocked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                 >
                    {timelineItems.filter(i => i.track === 'video').map(item => (
                       <TimelineClip key={item.id} item={item} selected={selectedElement === item.id} onClick={() => handleElementClick(item.id)} zoom={zoomLevel} />
                    ))}
                 </TimelineTrack>

                 {/* TRACK 4: AUDIO / MUSIC */}
                 <TimelineTrack 
                    id="audio" label="Audio" icon={Music} 
                    isLocked={tracksLocked.includes('audio')}
                    onToggleLock={(id) => setTracksLocked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                 >
                    {timelineItems.filter(i => i.track === 'audio').map(item => (
                       <TimelineClip key={item.id} item={item} selected={selectedElement === item.id} onClick={() => handleElementClick(item.id)} zoom={zoomLevel} isAudio />
                    ))}
                 </TimelineTrack>

              </div>
           </div>

           {/* SECONDARY TOOL PANEL TABS */}
           <div className="bg-black/80 backdrop-blur-3xl border-t border-white/5 safe-bottom">
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-6 px-8">
                 {[
                   { id: 'Edit', icon: Scissors },
                   { id: 'Audio', icon: Mic },
                   { id: 'Color', icon: Palette },
                   { id: 'Effects', icon: Ghost },
                   { id: 'Text', icon: Type },
                   { id: 'AI', icon: Sparkles }
                 ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveToolPanel(tab.id)}
                     className={`flex flex-col items-center gap-3 group min-w-[72px] transition-all ${activeToolPanel === tab.id ? 'translate-y-[-4px]' : ''}`}
                   >
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 relative ${activeToolPanel === tab.id ? 'bg-primary text-white shadow-[0_10px_30px_rgba(108,92,231,0.5)]' : 'bg-white/5 text-white/20 group-hover:bg-white/10'}`}>
                         <tab.icon className="w-5 h-5" />
                         {activeToolPanel === tab.id && (
                            <motion.div layoutId="tab-active-glow" className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl -z-10" />
                         )}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${activeToolPanel === tab.id ? 'text-primary' : 'text-white/20'}`}>{tab.id}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Floating Add Media Button */}
      <button className="fixed bottom-40 right-8 w-20 h-20 bg-white text-black rounded-[28px] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 transition-all z-50 group hover:bg-primary hover:text-white">
         <Plus className="w-10 h-10 group-hover:scale-110 transition-transform" />
      </button>

      {/* Tool Panel (Slide-up) */}
      <AnimatePresence>
        {activeToolPanel && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[120] bg-[#1A1A1A] rounded-t-[40px] shadow-[0_-50px_100px_rgba(0,0,0,0.8)] border-t border-white/10 h-[45vh] flex flex-col"
          >
            <div className="h-14 px-8 flex items-center justify-between border-b border-white/5">
               <h3 className="text-xs font-black uppercase tracking-widest text-white/60">{activeToolPanel}</h3>
               <button onClick={closePanel} className="w-8 h-8 glass rounded-full flex items-center justify-center text-white/40"><Plus className="w-4 h-4 rotate-45" /></button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
               {/* Contextual Panel Content */}
               {activeToolPanel === 'AI' ? (
                  <div className="space-y-8 py-2">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Asset Match</p>
                          <div className="glass rounded-3xl p-5 aspect-square flex flex-col items-center justify-center relative overflow-hidden group">
                             <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                             {syncMatch !== null ? (
                               <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center z-10">
                                  <span className="text-4xl font-display font-black text-primary">{syncMatch}%</span>
                                  <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mt-1">Sync Probability</p>
                               </motion.div>
                             ) : (
                               <div className="text-center z-10">
                                  <AudioLines className="w-8 h-8 text-white/20 mx-auto mb-2" />
                                  <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Analyze Beat Sync</p>
                               </div>
                             )}
                          </div>
                          <button 
                            onClick={analyzeSync}
                            className="w-full py-3 glass rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/5 active:scale-95 transition-all text-white/60"
                          >
                            Detect Synergy
                          </button>
                       </div>

                       <div className="space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">AI Pro Mode</p>
                          <div className="glass rounded-3xl p-5 aspect-square flex flex-col items-center justify-center relative border border-primary/20 group cursor-pointer hover:border-primary/50 transition-all overflow-hidden" onClick={runAIAutoEdit}>
                             {isAIProcessing ? (
                               <div className="space-y-4 text-center z-10">
                                  <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                  <p className="text-[9px] font-black uppercase tracking-widest text-primary animate-pulse">Editing...</p>
                               </div>
                             ) : (
                               <div className="text-center z-10">
                                  <Zap className="w-8 h-8 text-primary mx-auto mb-2 fill-current" />
                                  <p className="text-[9px] font-black uppercase tracking-widest text-white/60">One-Tap Pro Edit</p>
                               </div>
                             )}
                             <motion.div 
                               animate={{ opacity: [0, 0.5, 0] }}
                               transition={{ duration: 2, repeat: Infinity }}
                               className="absolute inset-0 bg-primary/10 pointer-events-none"
                             />
                          </div>
                          <p className="text-[8px] text-white/20 text-center italic">Level: Hollywood Standard</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                       {[
                         { id: 'rembg', label: 'BG Removal', icon: UserMinus },
                         { id: 'track', label: 'Obj Tracking', icon: Target },
                         { id: 'cut', label: 'Smart Cut', icon: Scissors }
                       ].map(tool => (
                         <button key={tool.id} className="glass p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/5 transition-all">
                            <tool.icon className="w-4 h-4 text-primary/60" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{tool.label}</span>
                         </button>
                       ))}
                    </div>
                  </div>
               ) : activeToolPanel === 'Filters' ? (
                 <div className="grid grid-cols-3 gap-3">
                   {PRESETS.map(p => (
                     <div key={p.id} className="aspect-square glass rounded-2xl overflow-hidden relative group cursor-pointer">
                       <img src={p.previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100" alt="" />
                       <div className="absolute inset-x-0 bottom-0 p-3 bg-black/60 backdrop-blur-md">
                         <p className="text-[10px] font-bold truncate">{p.name}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : activeToolPanel === 'Effects' ? (
                  <div className="flex flex-col h-full -mt-2">
                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 shrink-0">
                      {['All', 'Motion', 'Glitch', 'Light', 'Blur', 'Viral Packs'].map(cat => (
                        <button 
                          key={cat} 
                          onClick={() => setEffectCategory(cat)}
                          className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${effectCategory === cat ? 'bg-primary text-white' : 'glass text-white/30'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                      {effectCategory === 'Viral Packs' ? (
                        <div className="space-y-6">
                           {PRESET_PACKS.map(pack => (
                             <div key={pack.id} className="relative h-40 rounded-3xl overflow-hidden group cursor-pointer border border-white/5">
                               <img src={pack.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-all" alt="" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
                                  <h4 className="text-lg font-bold">{pack.name}</h4>
                                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{pack.effects.length} Effects</p>
                               </div>
                               <button className="absolute top-6 right-6 w-10 h-10 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                  <Plus className="w-5 h-5" />
                               </button>
                             </div>
                           ))}
                        </div>
                      ) : selectedEffectId ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-4">
                          <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden glass border border-white/10 shrink-0">
                               <img src={EFFECTS.find(e => e.id === selectedEffectId)?.previewUrl} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                               <h4 className="text-xl font-bold leading-none mb-2">{EFFECTS.find(e => e.id === selectedEffectId)?.name}</h4>
                               <p className="text-[10px] text-primary uppercase font-black tracking-[0.2em]">{EFFECTS.find(e => e.id === selectedEffectId)?.category}</p>
                            </div>
                          </div>

                          <div className="space-y-8">
                             {EFFECTS.find(e => e.id === selectedEffectId)?.parameters?.map(param => (
                               <div key={param.label} className="space-y-3">
                                 <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{param.label}</span>
                                    <span className="text-[10px] font-mono font-bold text-primary">{effectParams[param.label] ?? param.defaultValue}</span>
                                 </div>
                                 <input 
                                   type="range"
                                   min={param.min}
                                   max={param.max}
                                   value={effectParams[param.label] ?? param.defaultValue}
                                   onChange={(e) => setEffectParams(prev => ({ ...prev, [param.label]: parseInt(e.target.value) }))}
                                   className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-primary cursor-pointer"
                                 />
                               </div>
                             ))}
                          </div>

                          <div className="flex gap-3 pt-6">
                            <button onClick={() => setSelectedEffectId(null)} className="flex-1 py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30">Cancel</button>
                            <button onClick={() => { setSelectedEffectId(null); setActiveToolPanel(null); }} className="flex-1 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Apply Effect</button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="grid grid-cols-3 gap-3">
                          {EFFECTS.filter(e => effectCategory === 'All' || e.category === effectCategory).map(e => (
                            <div 
                              key={e.id} 
                              onClick={() => {
                                setSelectedEffectId(e.id);
                                const initialParams: Record<string, number> = {};
                                e.parameters?.forEach(p => initialParams[p.label] = p.defaultValue);
                                setEffectParams(initialParams);
                              }}
                              className="aspect-square glass rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 hover:border-primary/50 transition-colors"
                            >
                              <img src={e.previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" alt="" />
                              <div className="absolute inset-x-0 bottom-0 p-3 bg-black/60 backdrop-blur-md">
                                <p className="text-[9px] font-black truncate uppercase tracking-tight">{e.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
               ) : activeToolPanel === 'Anim' ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'fade', label: 'Fade In', icon: Ghost },
                      { id: 'slide', label: 'Slide Up', icon: MoveUpRight },
                      { id: 'type', label: 'Typewriter', icon: Type },
                      { id: 'none', label: 'No Anim', icon: Plus }
                    ].map(anim => (
                      <button 
                        key={anim.id}
                        onClick={() => setActiveToolPanel(null)}
                        className="glass p-6 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all hover:border-primary/50 group"
                      >
                        <anim.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">{anim.label}</span>
                      </button>
                    ))}
                  </div>
               ) : activeToolPanel === 'Adjust' ? (
                  <div className="space-y-8 py-4">
                    <div className="flex justify-between items-center px-1 border-b border-white/5 pb-4 mb-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary font-display">Cinematic Color</h4>
                      <button onClick={() => setAdjustments({ brightness: -8, contrast: 25, saturation: 8, temperature: 4, sharpen: 10 })} className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-lg">Apply Grade</button>
                    </div>
                    {[
                      { key: 'brightness', label: 'Brightness', min: -50, max: 50 },
                      { key: 'contrast', label: 'Contrast', min: 0, max: 100 },
                      { key: 'saturation', label: 'Saturation', min: -50, max: 50 },
                    ].map(ctrl => (
                      <div key={ctrl.key} className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{ctrl.label}</span>
                           <span className="text-[10px] font-mono font-bold text-primary tabular-nums">{adjustments[ctrl.key]}</span>
                        </div>
                        <input 
                          type="range"
                          min={ctrl.min}
                          max={ctrl.max}
                          value={adjustments[ctrl.key]}
                          onChange={(e) => setAdjustments((prev: any) => ({ ...prev, [ctrl.key]: parseInt(e.target.value) }))}
                          className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-primary cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                ) : activeToolPanel === 'Audio' ? (
                  <div className="space-y-10 py-6 text-center">
                    <div className="flex gap-4">
                       <div className="flex-1 space-y-4">
                          <div className="h-40 glass rounded-3xl flex items-end p-2 gap-1 justify-center overflow-hidden">
                             {[1,2,3,4,5].map(i => <motion.div key={i} animate={{ height: ['20%','80%','30%'] }} transition={{ repeat: Infinity, duration: 1, delay: i*0.1 }} className="w-full bg-primary/20 rounded-full" />)}
                          </div>
                          <input type="range" value={audioSettings.voiceVol} onChange={(e) => setAudioSettings((p:any)=>({...p, voiceVol: parseInt(e.target.value)}))} className="w-full h-1 bg-white/10 rounded-full appearance-none accent-primary" />
                          <p className="text-[9px] font-black uppercase text-white/30">Voice: {audioSettings.voiceVol}%</p>
                       </div>
                       <div className="flex-1 space-y-4">
                          <div className="h-40 glass rounded-3xl flex items-end p-2 gap-1 justify-center overflow-hidden">
                             {[1,2,3,4,5].map(i => <motion.div key={i} animate={{ height: ['10%','60%','20%'] }} transition={{ repeat: Infinity, duration: 2, delay: i*0.2 }} className="w-full bg-secondary/20 rounded-full" />)}
                          </div>
                          <input type="range" value={audioSettings.musicVol} onChange={(e) => setAudioSettings((p:any)=>({...p, musicVol: parseInt(e.target.value)}))} className="w-full h-1 bg-white/10 rounded-full appearance-none accent-secondary" />
                          <p className="text-[9px] font-black uppercase text-white/30">Music: {audioSettings.musicVol}%</p>
                       </div>
                    </div>
                  </div>
                ) : activeToolPanel === 'Project' ? (
                  <div className="space-y-10 py-4">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Resolution</p>
                        <div className="grid grid-cols-2 gap-4">
                           {['1080p', '4K'].map(res => (
                             <button key={res} onClick={() => setProjectSettings((p:any)=>({...p, resolution: res}))} className={`py-5 rounded-3xl text-[10px] font-black uppercase transition-all ${projectSettings.resolution === res ? 'bg-primary text-white shadow-xl' : 'glass text-white/20'}`}>{res}</button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Ratio</p>
                        <div className="grid grid-cols-3 gap-4">
                           {[
                             { id: '9:16', icon: Smartphone },
                             { id: '16:9', icon: Monitor },
                             { id: '1:1', icon: Square }
                           ].map(ratio => (
                             <button key={ratio.id} onClick={() => setProjectSettings((p:any)=>({...p, ratio: ratio.id}))} className={`py-5 rounded-3xl flex flex-col items-center gap-2 transition-all ${projectSettings.ratio === ratio.id ? 'bg-primary text-white shadow-xl' : 'glass text-white/20'}`}>
                                <ratio.icon className="w-4 h-4" />
                                <span className="text-[9px] font-black">{ratio.id}</span>
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimelineTrack({ id, label, icon: Icon, children, isLocked, onToggleLock, active }: { id: string, label: string, icon: any, children: React.ReactNode, isLocked: boolean, onToggleLock: (id: string) => void, active?: boolean }) {
  return (
    <div className={`h-12 flex items-center relative group/track ${active ? 'bg-white/[0.02]' : ''}`}>
       <div className="absolute -left-20 w-20 flex flex-col items-center justify-center gap-1 opacity-20 group-hover/track:opacity-60 transition-opacity">
          <Icon className="w-4 h-4" />
          <span className="text-[7px] font-black uppercase tracking-widest">{label}</span>
       </div>
       
       <button 
         onClick={() => onToggleLock(id)}
         className={`absolute -left-6 z-10 p-1 rounded-md transition-all ${isLocked ? 'text-primary bg-primary/10 opacity-100' : 'text-white/10 opacity-0 group-hover/track:opacity-100 hover:text-white'}`}
       >
          {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
       </button>

       <div className={`flex-1 h-full flex items-center relative border-y border-white/[0.03] ${isLocked ? 'pointer-events-none opacity-50 grayscale' : ''}`}>
          {children}
       </div>
    </div>
  );
}

function TimelineClip({ item, selected, onClick, zoom, isAudio }: { item: any, selected: boolean, onClick: () => void, zoom: number, isAudio?: boolean }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      layoutId={item.id}
      style={{ left: item.start, width: item.width }}
      className={`absolute h-[80%] rounded-xl flex items-center px-4 border transition-all cursor-pointer group/clip overflow-hidden shadow-2xl ${
        selected ? 'ring-2 ring-primary border-primary bg-primary/30 z-20' : `border-white/10 ${item.color} hover:bg-white/10`
      }`}
    >
      {isAudio && (
        <div className="absolute inset-0 flex items-center gap-[1px] px-2 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex-1 bg-white" style={{ height: `${Math.random() * 80 + 10}%` }} />
          ))}
        </div>
      )}
      
      <span className={`text-[9px] font-black truncate uppercase tracking-tighter relative z-10 ${selected ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
        {item.label}
      </span>

      {selected && !isAudio && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 pointer-events-none" />
      )}

      {selected && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white shadow-[2px_0_10px_rgba(255,255,255,0.5)] cursor-ew-resize active:bg-primary transition-colors" />
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white shadow-[-2px_0_10px_rgba(255,255,255,0.5)] cursor-ew-resize active:bg-primary transition-colors" />
        </>
      )}
    </motion.div>
  );
}

// Reusing and updating existing logic from previous turns
function CreateView({ copyToClipboard }: { copyToClipboard: (t: string) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'caption' | 'beatsync'>('caption');
  const [prompt, setPrompt] = useState(() => localStorage.getItem('editpro_draft_prompt') || '');
  const [category, setCategory] = useState(() => localStorage.getItem('editpro_draft_category') || 'Viral');
  const [selectedVoice, setSelectedVoice] = useState(() => localStorage.getItem('editpro_draft_voice') || 'Siri Style');
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    localStorage.setItem('editpro_draft_prompt', prompt);
    localStorage.setItem('editpro_draft_category', category);
    localStorage.setItem('editpro_draft_voice', selectedVoice);
  }, [prompt, category, selectedVoice]);

  const [selectedSoundId, setSelectedSoundId] = useState<string>(SOUNDS[0].id);
  const [isDetecting, setIsDetecting] = useState(false);
  const [markers, setMarkers] = useState<number[]>([]);

  const selectedSound = SOUNDS.find(s => s.id === selectedSoundId);

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setPrompt(prev => prev ? `${prev}\n(Analyzing video: ${file.name})` : `Uploaded video: ${file.name}`);
    }
  };

  const handleBeatSync = () => {
    if (!selectedSound) return;
    setIsDetecting(true);
    setTimeout(() => {
      setMarkers(selectedSound.beatIntervals);
      setIsDetecting(false);
    }, 1500);
  };

  const handleGenerate = async () => {
    if (!prompt && !videoFile) return;
    setLoading(true);
    const results = await generateCaptions(prompt || `Analyze this video: ${videoFile?.name}`, category);
    setCaptions(results);
    setLoading(false);
  };

  return (
    <div className="space-y-8 h-full overflow-y-auto no-scrollbar pb-32">
      <div className="flex p-1.5 glass rounded-2xl border border-white/5">
        <button onClick={() => setActiveSubTab('caption')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'caption' ? 'bg-white text-black' : 'text-white/40'}`}>Caption Gen</button>
        <button onClick={() => setActiveSubTab('beatsync')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'beatsync' ? 'bg-white text-black' : 'text-white/40'}`}>Beat Sync</button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'caption' ? (
          <motion.div key="caption" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <label className="w-full h-36 bg-white/[0.03] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
                <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                {videoFile ? <p className="text-[10px] text-white/40 truncate w-full px-4">{videoFile.name}</p> : <><Plus className="w-6 h-6 mb-2 opacity-20" /><span className="text-[10px] font-black opacity-40">Add Clip</span></>}
              </label>
              <textarea 
                value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="Topic or scene details..."
                className="flex-1 w-full glass rounded-3xl p-4 focus:outline-none focus:border-primary transition-all text-xs resize-none"
              />
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Vibe & Tone</p>
              <div className="flex flex-wrap gap-2">
                {['Savage', 'Sad Vibes', 'Aesthetic', 'Hype'].map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase transition-all ${category === cat ? 'bg-primary text-white' : 'glass text-white/30'}`}>{cat}</button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || (!prompt && !videoFile)}
              className="w-full py-5 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all active:scale-95 disabled:opacity-30"
            >
              {loading ? "Thinking..." : "Generate Magic"}
            </button>

            {captions.length > 0 && (
              <div className="space-y-4">
                {captions.map((caption, i) => (
                  <div key={i} className="glass p-6 rounded-3xl relative group">
                    <p className="text-sm leading-relaxed pr-8">{caption}</p>
                    <button onClick={() => copyToClipboard(caption)} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"><Download className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="beatsync" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
            <div className="glass p-8 rounded-[40px] space-y-6 text-center">
              <Volume2 className="w-12 h-12 text-secondary mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Auto-Peak Detection</h3>
                <p className="text-[11px] text-white/40 leading-relaxed max-w-[200px] mx-auto">Analyze audio peaks for perfect CapCut markers.</p>
              </div>
              <select value={selectedSoundId} onChange={(e) => setSelectedSoundId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs focus:outline-none focus:border-secondary">
                {SOUNDS.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
              <button 
                onClick={handleBeatSync}
                className="w-full py-4 bg-secondary text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-secondary/20 h-14"
              >
                {isDetecting ? "Detecting Peaks..." : "Analyze Audio"}
              </button>

              {markers.length > 0 && !isDetecting && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                  {markers.map((m, i) => <div key={i} className="flex-shrink-0 px-3 py-1.5 glass rounded-lg text-[10px] font-mono text-secondary">{m}s</div>)}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileView({ 
  favSounds, 
  favPresets,
  playSound,
  playingSoundId,
  downloadSound,
  userName,
  setUserName,
  profilePic,
  setProfilePic
}: { 
  favSounds: Sound[], 
  favPresets: Preset[],
  playSound: (s: Sound) => void,
  playingSoundId: string | null,
  downloadSound: (s: Sound) => void,
  userName: string,
  setUserName: (val: string) => void,
  profilePic: string | null,
  setProfilePic: (val: string | null) => void
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setUserName(tempName);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-12">
      <header className="pt-10 flex flex-col items-center relative">
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="absolute top-10 right-0 p-3 glass rounded-2xl text-white/40 hover:text-white transition-all active:scale-90"
        >
          {isEditing ? <Check className="w-5 h-5 text-primary" /> : <Settings className="w-5 h-5" />}
        </button>

        <div className="w-32 h-32 rounded-[48px] bg-gradient-to-tr from-primary via-secondary to-primary p-1.5 shadow-2xl shadow-primary/20">
          <div className="w-full h-full rounded-[44px] bg-dark-bg flex items-center justify-center overflow-hidden relative group">
             {profilePic ? (
               <img src={profilePic} className="w-full h-full object-cover" alt="Profile" />
             ) : (
               <User className="w-12 h-12 text-white/40" />
             )}
             
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm"
             >
                <Camera className="w-6 h-6 text-white" />
             </div>
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*" 
               onChange={handleFileChange} 
             />
          </div>
        </div>

        <div className="text-center mt-6 w-full max-w-[240px]">
          {isEditing ? (
            <input 
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full bg-white/5 border border-primary/30 rounded-xl px-4 py-2 text-center text-xl font-display font-black focus:outline-none focus:border-primary transition-all"
              autoFocus
            />
          ) : (
            <h2 className="text-2xl font-display font-black tracking-tight underline decoration-primary/30 underline-offset-8">{userName}</h2>
          )}
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-3">Creator Tier • Pro</p>
        </div>
      </header>

      <section className="space-y-6">
         <div className="flex items-center justify-between px-1">
           <h3 className="text-sm font-black uppercase tracking-widest text-white/60">My Library</h3>
         </div>
         <div className="grid grid-cols-2 gap-4">
           <ProfileCounter label="Saved Effects" count={EFFECTS.length} color="bg-secondary/10" icon={Sparkles} />
           <ProfileCounter label="My Projects" count={4} color="bg-primary/10" icon={Layout} />
         </div>
      </section>

      <section className="space-y-6">
         <div className="flex items-center justify-between px-1">
           <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Recently Edited</h3>
           <button className="text-[10px] font-black uppercase tracking-widest text-primary">Clear</button>
         </div>
         <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-shrink-0 w-44 glass p-3 rounded-[28px] space-y-3 group cursor-pointer hover:bg-white/5 transition-all">
                 <div className="aspect-square rounded-2xl overflow-hidden relative">
                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=200&q=80`} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt="" />
                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                 </div>
                 <div className="px-1">
                    <p className="text-[10px] font-bold truncate">Project_v{i}.mp4</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-0.5">2 days ago</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      <section className="space-y-6">
         <div className="flex items-center justify-between px-1">
           <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Favorites</h3>
         </div>
         <div className="grid gap-4">
           {favSounds.map(s => (
             <div key={s.id} className="glass p-4 rounded-3xl flex items-center gap-5 group hover:bg-white/[0.08] transition-all border-white/5">
                <div className="w-14 h-14 rounded-2xl overflow-hidden relative shrink-0">
                  <img src={s.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => playSound(s)}
                      className="w-10 h-10 glass rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                    >
                      {playingSoundId === s.id ? (
                        <div className="flex gap-1 items-end h-3">
                            <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white" />
                            <motion.div animate={{ height: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white" />
                            <motion.div animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white" />
                        </div>
                      ) : (
                        <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate mb-1">{s.title}</h4>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest leading-none">{s.artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => downloadSound(s)}
                    className="p-3 rounded-full text-white/20 hover:text-white/60 hover:bg-white/5 transition-all active:scale-90"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
             </div>
           ))}
           {favSounds.length === 0 && <EmptyState message="No favorites yet" />}
         </div>
      </section>
    </div>
  );
}

function ProfileCounter({ label, count, color, icon: Icon }: { label: string, count: number, color: string, icon: any }) {
  return (
    <div className={`${color} glass p-6 rounded-[32px] space-y-4`}>
       <Icon className="w-5 h-5 text-white/80" />
       <div>
         <p className="text-2xl font-display font-black leading-none">{count}</p>
         <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-1">{label}</p>
       </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 glass rounded-3xl border-dashed border-white/10">
      <AlertCircle className="w-6 h-6 text-white/10 mb-2" />
      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{message}</p>
    </div>
  );
}
