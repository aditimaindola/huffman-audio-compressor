
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, Volume2 } from 'lucide-react';

interface AudioInputProps {
  onAudioProcessed: (text: string) => void;
  isProcessing: boolean;
}

const AudioInput: React.FC<AudioInputProps> = ({ onAudioProcessed, isProcessing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioData, setAudioData] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      console.log('Audio file selected:', file.name, file.size);
      setSelectedFile(file);
      processAudioFile(file);
    } else {
      console.log('Invalid file type selected');
    }
  };

  const processAudioFile = async (file: File) => {
    try {
      console.log('Starting audio file processing...');
      const arrayBuffer = await file.arrayBuffer();
      console.log('Audio file loaded, size:', arrayBuffer.byteLength);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      console.log('Audio decoded, duration:', audioBuffer.duration, 'channels:', audioBuffer.numberOfChannels);
      
      // Get audio data from the first channel
      const channelData = audioBuffer.getChannelData(0);
      console.log('Channel data length:', channelData.length);
      
      // Sample the audio data (take every nth sample to reduce size)
      const targetSamples = Math.min(1000, channelData.length); // Limit to 1000 samples
      const sampleRate = Math.max(1, Math.floor(channelData.length / targetSamples));
      const sampledData: number[] = [];
      
      for (let i = 0; i < channelData.length; i += sampleRate) {
        sampledData.push(channelData[i]);
      }
      
      console.log('Sampled data length:', sampledData.length);
      setAudioData(sampledData);
      
      // Convert audio samples to text representation for Huffman coding
      const textRepresentation = convertAudioToText(sampledData);
      console.log('Text representation length:', textRepresentation.length);
      console.log('Text sample:', textRepresentation.substring(0, 50));
      
      if (textRepresentation.length === 0) {
        console.error('No text generated from audio');
        return;
      }
      
      onAudioProcessed(textRepresentation);
      
    } catch (error) {
      console.error('Error processing audio file:', error);
    }
  };

  const convertAudioToText = (samples: number[]): string => {
    if (samples.length === 0) {
      console.log('No samples to convert');
      return '';
    }
    
    // Quantize audio samples into discrete levels and map to characters
    const levels = 8; // Use 8 levels for simplicity
    const chars = 'abcdefgh'; // Map each level to a character
    
    const result = samples.map(sample => {
      // Normalize sample from [-1, 1] to [0, levels-1]
      const normalizedSample = Math.max(0, Math.min(1, (sample + 1) / 2));
      const level = Math.floor(normalizedSample * (levels - 1));
      return chars[level];
    }).join('');
    
    console.log('Audio converted to text, unique characters:', new Set(result).size);
    return result;
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Audio File Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">Upload Audio File</p>
            <p className="text-sm text-gray-500">Supports MP3, WAV, and other audio formats</p>
          </div>
          
          <Button 
            onClick={triggerFileInput}
            disabled={isProcessing}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Select Audio File
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {selectedFile && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <File className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {audioData.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium">Audio processed:</p>
                <p className="text-xs text-gray-600">
                  {audioData.length} samples converted to text representation
                </p>
              </div>
            )}
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">How Audio Processing Works:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Audio file is decoded into raw sample data</li>
            <li>• Samples are quantized into discrete levels (8 levels)</li>
            <li>• Each level is mapped to a character (a-h)</li>
            <li>• The resulting text is processed by Huffman algorithm</li>
            <li>• This simulates digital audio compression techniques</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioInput;
