import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface SoundscapeBuilderProps {
  onComplete: () => void;
}

interface Sound {
  id: string;
  name: string;
  icon: string;
  category: 'nature' | 'ambient' | 'instruments' | 'meditation';
  playing: boolean;
  volume: number;
}

const SoundscapeBuilder = ({ onComplete }: SoundscapeBuilderProps) => {
  const [view, setView] = useState<'start' | 'build' | 'saved'>('start');
  const [activeTab, setActiveTab] = useState<'nature' | 'ambient' | 'instruments' | 'meditation'>('nature');
  const [masterVolume, setMasterVolume] = useState(80);
  const [playingAll, setPlayingAll] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(600); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [savedMixes, setSavedMixes] = useState<string[]>([]);
  const [activeMixName, setActiveMixName] = useState('');

  // List of all available sounds
  const [sounds, setSounds] = useState<Sound[]>([
    // Nature sounds
    { id: 'rain', name: 'Gentle Rain', icon: '🌧️', category: 'nature', playing: false, volume: 70 },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊', category: 'nature', playing: false, volume: 60 },
    { id: 'forest', name: 'Forest Birds', icon: '🌳', category: 'nature', playing: false, volume: 50 },
    { id: 'thunder', name: 'Distant Thunder', icon: '⛈️', category: 'nature', playing: false, volume: 40 },
    { id: 'creek', name: 'Bubbling Creek', icon: '💧', category: 'nature', playing: false, volume: 60 },
    { id: 'campfire', name: 'Crackling Fire', icon: '🔥', category: 'nature', playing: false, volume: 50 },
    
    // Ambient sounds
    { id: 'whiteNoise', name: 'White Noise', icon: '📻', category: 'ambient', playing: false, volume: 50 },
    { id: 'pinkNoise', name: 'Pink Noise', icon: '📻', category: 'ambient', playing: false, volume: 50 },
    { id: 'spaceDrone', name: 'Space Drone', icon: '🌌', category: 'ambient', playing: false, volume: 40 },
    { id: 'deepHum', name: 'Deep Hum', icon: '📳', category: 'ambient', playing: false, volume: 30 },
    { id: 'cityRain', name: 'City Rainfall', icon: '🏙️', category: 'ambient', playing: false, volume: 60 },
    
    // Instrument sounds
    { id: 'piano', name: 'Gentle Piano', icon: '🎹', category: 'instruments', playing: false, volume: 50 },
    { id: 'chimes', name: 'Wind Chimes', icon: '🔔', category: 'instruments', playing: false, volume: 40 },
    { id: 'bowls', name: 'Singing Bowls', icon: '🥣', category: 'instruments', playing: false, volume: 50 },
    { id: 'flute', name: 'Bamboo Flute', icon: '🎵', category: 'instruments', playing: false, volume: 40 },
    { id: 'harp', name: 'Harp Glissando', icon: '🎻', category: 'instruments', playing: false, volume: 45 },
    
    // Meditation sounds
    { id: 'om', name: 'Om Chanting', icon: '🧘', category: 'meditation', playing: false, volume: 50 },
    { id: 'bells', name: 'Meditation Bells', icon: '🔔', category: 'meditation', playing: false, volume: 45 },
    { id: 'breath', name: 'Guided Breathing', icon: '💨', category: 'meditation', playing: false, volume: 60 },
    { id: 'heartbeat', name: 'Slow Heartbeat', icon: '❤️', category: 'meditation', playing: false, volume: 40 },
  ]);
  
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Handle audio playback simulation
  useEffect(() => {
    if (timerActive && currentTime < duration) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            stopAllSounds();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (!timerActive && timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerActive, duration, currentTime]);
  
  // Load saved mixes from localStorage
  useEffect(() => {
    const savedMixesJson = localStorage.getItem('soundscapeMixes');
    if (savedMixesJson) {
      setSavedMixes(JSON.parse(savedMixesJson));
    }
  }, []);
  
  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle a specific sound
  const toggleSound = (id: string) => {
    setSounds(prev => 
      prev.map(sound => 
        sound.id === id 
          ? { ...sound, playing: !sound.playing } 
          : sound
      )
    );
    
    // Check if any sound is playing
    const anyPlaying = sounds.some(s => s.id === id ? !s.playing : s.playing);
    setPlayingAll(anyPlaying);
    
    if (!timerActive && anyPlaying) {
      setTimerActive(true);
    }
  };
  
  // Adjust volume for a specific sound
  const adjustVolume = (id: string, volume: number) => {
    setSounds(prev => 
      prev.map(sound => 
        sound.id === id 
          ? { ...sound, volume } 
          : sound
      )
    );
  };
  
  // Play/pause all active sounds
  const togglePlayAll = () => {
    const newPlayingState = !playingAll;
    setPlayingAll(newPlayingState);
    setTimerActive(newPlayingState);
    
    // If playing, only toggle sounds that are marked as active
    if (newPlayingState) {
      setSounds(prev => 
        prev.map(sound => 
          sound.playing 
            ? { ...sound, playing: true } 
            : sound
        )
      );
    } else {
      // If pausing, mark all as paused but retain which ones are part of the mix
      setSounds(prev => 
        prev.map(sound => ({ ...sound, playing: false }))
      );
    }
  };
  
  // Stop all sounds and reset
  const stopAllSounds = () => {
    setPlayingAll(false);
    setTimerActive(false);
    setCurrentTime(0);
    
    toast({
      title: "Soundscape complete",
      description: "Your relaxation session has ended.",
      duration: 5000,
    });
  };
  
  // Save current mix
  const saveMix = () => {
    const activeSoundIds = sounds
      .filter(sound => sound.playing)
      .map(sound => `${sound.id}:${sound.volume}`);
    
    if (activeSoundIds.length === 0) {
      toast({
        title: "No sounds active",
        description: "Please activate at least one sound before saving.",
      });
      return;
    }
    
    const mixName = `Mix ${savedMixes.length + 1}`;
    const mixData = JSON.stringify({
      name: mixName,
      sounds: activeSoundIds,
      masterVolume
    });
    
    setSavedMixes(prev => [...prev, mixData]);
    localStorage.setItem('soundscapeMixes', JSON.stringify([...savedMixes, mixData]));
    
    setActiveMixName(mixName);
    
    toast({
      title: "Mix saved!",
      description: `Your soundscape "${mixName}" has been saved and can be loaded anytime.`,
      duration: 3000,
    });
  };
  
  // Load a saved mix
  const loadMix = (mixData: string) => {
    try {
      const mix = JSON.parse(mixData);
      const mixSounds = mix.sounds;
      const mixVolume = mix.masterVolume;
      
      // Reset all sounds
      setSounds(prev => 
        prev.map(sound => ({ ...sound, playing: false, volume: 50 }))
      );
      
      // Apply saved sounds and their volumes
      setSounds(prev => 
        prev.map(sound => {
          const savedSound = mixSounds.find((s: string) => s.startsWith(`${sound.id}:`));
          if (savedSound) {
            const volume = parseInt(savedSound.split(':')[1], 10);
            return { ...sound, playing: true, volume };
          }
          return sound;
        })
      );
      
      setMasterVolume(mixVolume || 80);
      setActiveMixName(mix.name);
      
      toast({
        title: "Mix loaded",
        description: `"${mix.name}" has been loaded. Press play to start the soundscape.`,
        duration: 3000,
      });
      
      setView('build');
    } catch (error) {
      toast({
        title: "Error loading mix",
        description: "There was a problem loading this soundscape mix.",
        duration: 3000,
      });
    }
  };
  
  // Get filtered sounds based on active tab
  const filteredSounds = sounds.filter(sound => sound.category === activeTab);
  
  // Get active sounds that are part of the current mix
  const activeSoundsCount = sounds.filter(sound => sound.playing).length;
  
  // Start screen view
  if (view === 'start') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 fade-in">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎵</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Soundscape Builder</h2>
            <p className="text-muted-foreground mb-3">
              Create your personal calm space by mixing ambient sounds
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button onClick={() => setView('build')} className="h-24 flex flex-col items-center justify-center btn-pulse">
              <span className="text-2xl mb-1">🎹</span>
              <span>Create New Mix</span>
            </Button>
            <Button 
              onClick={() => setView('saved')} 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center"
              disabled={savedMixes.length === 0}
            >
              <span className="text-2xl mb-1">💾</span>
              <span>Load Saved Mix</span>
              {savedMixes.length > 0 && (
                <span className="text-xs">{savedMixes.length} available</span>
              )}
            </Button>
            <Button 
              onClick={() => {
                // Quick play rain and piano
                setSounds(prev => 
                  prev.map(sound => 
                    (sound.id === 'rain' || sound.id === 'piano') 
                      ? { ...sound, playing: true } 
                      : { ...sound, playing: false }
                  )
                );
                setPlayingAll(true);
                setTimerActive(true);
                setView('build');
              }} 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">⏯️</span>
              <span>Quick Play</span>
              <span className="text-xs">Rain + Piano</span>
            </Button>
            <Button onClick={onComplete} variant="outline" className="h-24 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🏠</span>
              <span>Exit Game</span>
            </Button>
          </div>
          
          <Card className="mb-4">
            <CardContent className="p-6 text-center">
              <h3 className="font-medium mb-3">How Sound Therapy Works</h3>
              <p className="text-sm text-muted-foreground">
                Different sounds affect our nervous system in unique ways. Creating a personalized soundscape can help reduce stress, improve focus, and promote better sleep.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Saved mixes view
  if (view === 'saved') {
    return (
      <div className="flex flex-col h-full p-4 max-w-lg mx-auto fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Saved Mixes</h2>
          <Button onClick={() => setView('start')} variant="outline" size="sm">
            Back
          </Button>
        </div>
        
        {savedMixes.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-lg font-medium mb-2">No saved mixes</h3>
            <p className="text-muted-foreground mb-4">Create and save your first soundscape mix</p>
            <Button onClick={() => setView('build')} className="btn-pulse">
              Create First Mix
            </Button>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto flex-grow">
            {savedMixes.map((mixData, index) => {
              const mix = JSON.parse(mixData);
              const soundCount = mix.sounds.length;
              
              return (
                <Card key={index} className="cursor-pointer hover:shadow transition-shadow" onClick={() => loadMix(mixData)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{mix.name}</h3>
                        <p className="text-sm text-muted-foreground">{soundCount} sound{soundCount !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex">
                        {mix.sounds.slice(0, 3).map((sound: string, i: number) => {
                          const soundId = sound.split(':')[0];
                          const matchedSound = sounds.find(s => s.id === soundId);
                          return (
                            <div key={i} className="w-8 h-8 -ml-2 bg-muted/30 rounded-full flex items-center justify-center">
                              <span className="text-lg">{matchedSound?.icon || '🔊'}</span>
                            </div>
                          );
                        })}
                        {mix.sounds.length > 3 && (
                          <div className="w-8 h-8 -ml-2 bg-muted/30 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">+{mix.sounds.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        <Button onClick={() => setView('build')} className="mt-4 btn-pulse">
          Create New Mix
        </Button>
      </div>
    );
  }
  
  // Main build view
  return (
    <div className="flex flex-col h-full p-4 max-w-lg mx-auto fade-in">
      {/* Header and controls */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Soundscape Builder</h2>
          <Button onClick={() => setView('start')} variant="outline" size="sm">
            Back
          </Button>
        </div>
        
        {activeMixName && (
          <p className="text-sm text-muted-foreground mb-2">Current mix: {activeMixName}</p>
        )}
      </div>
      
      {/* Playback controls */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Button 
                onClick={togglePlayAll} 
                size="sm" 
                disabled={activeSoundsCount === 0}
                className={`w-12 h-12 rounded-full ${playingAll ? 'bg-green-500 hover:bg-green-600' : ''}`}
              >
                <span className="text-xl">{playingAll ? '⏸️' : '▶️'}</span>
              </Button>
              <Button 
                onClick={stopAllSounds} 
                size="sm" 
                variant="outline" 
                disabled={!playingAll}
                className="w-10 h-10 rounded-full"
              >
                <span className="text-xl">⏹️</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{formatTime(currentTime)}</span>
              <span className="text-xs text-muted-foreground">/ {formatTime(duration)}</span>
            </div>
          </div>
          
          <Progress value={(currentTime / duration) * 100} className="h-2 mb-4" />
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="master-volume" className="flex items-center gap-2">
                <span className="text-lg">🔊</span>
                <span>Master Volume</span>
              </Label>
              <span className="text-sm">{masterVolume}%</span>
            </div>
            <Slider
              id="master-volume"
              min={0}
              max={100}
              step={1}
              value={[masterVolume]}
              onValueChange={value => setMasterVolume(value[0])}
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" onClick={saveMix} disabled={activeSoundsCount === 0}>
              Save Mix
            </Button>
            <div className="text-sm">
              <span className="px-2 py-1 bg-primary/10 rounded-full text-xs font-medium">
                {activeSoundsCount} sound{activeSoundsCount !== 1 ? 's' : ''} active
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Sound categories */}
      <Tabs defaultValue="nature" value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-grow overflow-hidden">
        <TabsList className="grid grid-cols-4 w-full mb-4">
          <TabsTrigger value="nature">Nature</TabsTrigger>
          <TabsTrigger value="ambient">Ambient</TabsTrigger>
          <TabsTrigger value="instruments">Music</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
        </TabsList>
        
        <div className="overflow-y-auto h-full pb-16">
          {['nature', 'ambient', 'instruments', 'meditation'].map((category) => (
            <TabsContent key={category} value={category} className="mt-0 space-y-3">
              {filteredSounds.map((sound) => (
                <Card key={sound.id} className={`${sound.playing ? 'border-primary bg-primary/5' : ''}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="text-xl">{sound.icon}</div>
                        <div>
                          <h4 className="font-medium">{sound.name}</h4>
                        </div>
                      </div>
                      <Switch 
                        checked={sound.playing}
                        onCheckedChange={() => toggleSound(sound.id)}
                      />
                    </div>
                    
                    {sound.playing && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span>Volume</span>
                          <span>{sound.volume}%</span>
                        </div>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[sound.volume]}
                          onValueChange={value => adjustVolume(sound.id, value[0])}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default SoundscapeBuilder;