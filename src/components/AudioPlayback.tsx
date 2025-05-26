
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeOff } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AudioPlaybackProps {
  originalText: string;
  encodedMessage: string;
  decodedMessage: string;
  codes: {[key: string]: string};
  isPlaying: boolean;
  onTogglePlayback: () => void;
}

const AudioPlayback: React.FC<AudioPlaybackProps> = ({
  originalText,
  encodedMessage,
  decodedMessage,
  codes,
  isPlaying,
  onTogglePlayback
}) => {
  const [currentMode, setCurrentMode] = useState<'original' | 'binary' | 'decoded'>('original');
  const [playbackSpeed, setPlaybackSpeed] = useState([500]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Audio synthesis for demonstration
  const playTone = (frequency: number, duration: number) => {
    if (isMuted) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  };

  const playSymbolSound = (symbol: string) => {
    // Map symbols to frequencies for demonstration
    const frequencies: {[key: string]: number} = {
      'a': 440, 'b': 493, 'c': 523, 'd': 587, 'e': 659, 'f': 698, 'g': 784,
      'h': 830, 'i': 880, 'j': 932, 'k': 987, 'l': 1046, 'm': 1108, 'n': 1174,
      'o': 1244, 'p': 1318, 'q': 1396, 'r': 1479, 's': 1567, 't': 1661,
      'u': 1760, 'v': 1864, 'w': 1975, 'x': 2093, 'y': 2217, 'z': 2349,
      ' ': 200 // Space as low frequency
    };
    
    const frequency = frequencies[symbol.toLowerCase()] || 400;
    playTone(frequency, 300);
  };

  const playBinarySound = (bit: string) => {
    // 0 = low tone, 1 = high tone
    const frequency = bit === '0' ? 300 : 600;
    playTone(frequency, 150);
  };

  const playSequence = async (text: string, mode: 'original' | 'binary' | 'decoded') => {
    if (!isPlaying) return;
    
    for (let i = 0; i < text.length; i++) {
      if (!isPlaying) break;
      
      setCurrentPosition(i);
      
      if (mode === 'binary') {
        playBinarySound(text[i]);
      } else {
        playSymbolSound(text[i]);
      }
      
      await new Promise(resolve => setTimeout(resolve, playbackSpeed[0]));
    }
    
    setCurrentPosition(0);
    onTogglePlayback();
  };

  useEffect(() => {
    if (isPlaying) {
      const textToPlay = currentMode === 'original' ? originalText :
                        currentMode === 'binary' ? encodedMessage :
                        decodedMessage;
      playSequence(textToPlay, currentMode);
    }
  }, [isPlaying, currentMode]);

  const getCurrentText = () => {
    switch (currentMode) {
      case 'original': return originalText;
      case 'binary': return encodedMessage;
      case 'decoded': return decodedMessage;
      default: return '';
    }
  };

  const renderPlaybackText = () => {
    const text = getCurrentText();
    return (
      <div className="font-mono text-lg leading-relaxed p-4 bg-gray-50 rounded border">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`${
              isPlaying && index === currentPosition 
                ? 'bg-blue-200 text-blue-800' 
                : 'text-gray-700'
            } transition-colors duration-200`}
          >
            {char === ' ' ? '⎵' : char}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Audio Playback Simulation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Playback Controls */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Button
            onClick={onTogglePlayback}
            disabled={!originalText}
            className="bg-green-500 hover:bg-green-600"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeOff className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm">Speed:</span>
            <Slider
              value={playbackSpeed}
              onValueChange={setPlaybackSpeed}
              max={1000}
              min={100}
              step={50}
              className="flex-1"
            />
            <span className="text-sm">{playbackSpeed[0]}ms</span>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-2">
          <Button
            variant={currentMode === 'original' ? 'default' : 'outline'}
            onClick={() => setCurrentMode('original')}
          >
            Original Text
          </Button>
          <Button
            variant={currentMode === 'binary' ? 'default' : 'outline'}
            onClick={() => setCurrentMode('binary')}
            disabled={!encodedMessage}
          >
            Binary Stream
          </Button>
          <Button
            variant={currentMode === 'decoded' ? 'default' : 'outline'}
            onClick={() => setCurrentMode('decoded')}
            disabled={!decodedMessage}
          >
            Decoded Text
          </Button>
        </div>

        {/* Playback Display */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {currentMode === 'original' && 'Original Message Playback'}
            {currentMode === 'binary' && 'Binary Stream Playback'}
            {currentMode === 'decoded' && 'Decoded Message Playback'}
          </h3>
          
          {renderPlaybackText()}
          
          {isPlaying && (
            <div className="text-sm text-blue-600">
              Playing: Position {currentPosition + 1} of {getCurrentText().length}
            </div>
          )}
        </div>

        {/* Symbol-to-Sound Mapping */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Interactive Symbol Player</h3>
          <div className="grid grid-cols-8 gap-2">
            {Object.entries(codes).map(([symbol, code]) => (
              <Button
                key={symbol}
                variant="outline"
                onClick={() => playSymbolSound(symbol)}
                className="h-12 text-sm"
                disabled={isMuted}
              >
                <div className="text-center">
                  <div className="font-mono">{symbol === ' ' ? '⎵' : symbol}</div>
                  <div className="text-xs text-gray-500">{code}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Audio Explanation */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Audio Simulation Features:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Original:</strong> Each symbol mapped to unique frequency</li>
            <li>• <strong>Binary:</strong> 0 = low tone (300Hz), 1 = high tone (600Hz)</li>
            <li>• <strong>Decoded:</strong> Reconstructed message verification</li>
            <li>• <strong>Interactive:</strong> Click symbols to hear their sound representation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayback;
