import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import HuffmanTreeVisualizer from '@/components/HuffmanTreeVisualizer';
import FrequencyTable from '@/components/FrequencyTable';
import AudioPlayback from '@/components/AudioPlayback';
import CompressionStats from '@/components/CompressionStats';
import CodebookDisplay from '@/components/CodebookDisplay';
import QuizMode from '@/components/QuizMode';
import AudioInput from '@/components/AudioInput';
import ConceptsDialog from '@/components/ConceptsDialog';
import { buildHuffmanTree, generateHuffmanCodes, encodeMessage, decodeMessage } from '@/utils/huffmanUtils';
import { Play, Pause, RotateCcw, Volume2, Type, Music } from 'lucide-react';

const Index = () => {
  const [inputText, setInputText] = useState("hello world");
  const [inputMode, setInputMode] = useState<'text' | 'audio'>('text');
  const [frequencyData, setFrequencyData] = useState<Array<{symbol: string, frequency: number}>>([]);
  const [huffmanTree, setHuffmanTree] = useState<any>(null);
  const [huffmanCodes, setHuffmanCodes] = useState<{[key: string]: string}>({});
  const [encodedMessage, setEncodedMessage] = useState("");
  const [decodedMessage, setDecodedMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const processInput = async () => {
    setIsProcessing(true);
    setAnimationStep(0);
    
    // Step 1: Frequency Analysis
    const frequency: {[key: string]: number} = {};
    for (const char of inputText) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    
    const freqData = Object.entries(frequency).map(([symbol, freq]) => ({
      symbol,
      frequency: freq
    })).sort((a, b) => b.frequency - a.frequency);
    
    setFrequencyData(freqData);
    setAnimationStep(1);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 2: Build Huffman Tree
    const tree = buildHuffmanTree(freqData);
    setHuffmanTree(tree);
    setAnimationStep(2);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Step 3: Generate Codes
    const codes = generateHuffmanCodes(tree);
    setHuffmanCodes(codes);
    setAnimationStep(3);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 4: Encode Message
    const encoded = encodeMessage(inputText, codes);
    setEncodedMessage(encoded);
    setAnimationStep(4);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 5: Decode Message
    const decoded = decodeMessage(encoded, tree);
    setDecodedMessage(decoded);
    setAnimationStep(5);
    
    setIsProcessing(false);
  };

  const resetDemo = () => {
    setFrequencyData([]);
    setHuffmanTree(null);
    setHuffmanCodes({});
    setEncodedMessage("");
    setDecodedMessage("");
    setAnimationStep(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAudioProcessed = (audioText: string) => {
    setInputText(audioText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Audio Compression with Huffman Coding
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive visualization of prefix-free coding algorithm for data compression with discrete mathematics concepts
          </p>
          
          {/* Add the Key Concepts button */}
          <div className="flex justify-center">
            <ConceptsDialog />
          </div>
        </div>

        {/* Input Mode Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Input Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Button
                variant={inputMode === 'text' ? 'default' : 'outline'}
                onClick={() => setInputMode('text')}
                className="flex items-center gap-2"
              >
                <Type className="w-4 h-4" />
                Text Input
              </Button>
              <Button
                variant={inputMode === 'audio' ? 'default' : 'outline'}
                onClick={() => setInputMode('audio')}
                className="flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                Audio File
              </Button>
            </div>

            {inputMode === 'text' ? (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter text to simulate audio stream (e.g., 'hello world')"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={processInput} 
                    disabled={isProcessing || !inputText.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isProcessing ? "Processing..." : "Analyze & Compress"}
                  </Button>
                  <Button variant="outline" onClick={resetDemo}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <AudioInput 
                  onAudioProcessed={handleAudioProcessed}
                  isProcessing={isProcessing}
                />
                <div className="flex gap-4">
                  <Button 
                    onClick={processInput} 
                    disabled={isProcessing || !inputText.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isProcessing ? "Processing..." : "Analyze & Compress"}
                  </Button>
                  <Button variant="outline" onClick={resetDemo}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            )}
            
            {isProcessing && (
              <div className="space-y-2 mt-4">
                <Progress value={(animationStep / 5) * 100} className="w-full" />
                <p className="text-sm text-gray-600 text-center">
                  {animationStep === 0 && "Analyzing frequency..."}
                  {animationStep === 1 && "Building Huffman tree..."}
                  {animationStep === 2 && "Generating codes..."}
                  {animationStep === 3 && "Encoding message..."}
                  {animationStep === 4 && "Decoding verification..."}
                  {animationStep === 5 && "Complete!"}
                </p>
              </div>
            )}

            {inputText && inputMode === 'audio' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Processed Audio Data:</h4>
                <div className="font-mono text-sm bg-white p-3 rounded border max-h-32 overflow-y-auto">
                  {inputText.substring(0, 200)}{inputText.length > 200 ? '...' : ''}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {inputText.length} characters generated from audio samples
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="visualization" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="visualization">Tree Visualization</TabsTrigger>
            <TabsTrigger value="frequency">Frequency Analysis</TabsTrigger>
            <TabsTrigger value="codebook">Codebook</TabsTrigger>
            <TabsTrigger value="audio">Audio Playback</TabsTrigger>
            <TabsTrigger value="compression">Compression Stats</TabsTrigger>
            <TabsTrigger value="quiz">Quiz Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="space-y-6">
            <HuffmanTreeVisualizer 
              tree={huffmanTree} 
              codes={huffmanCodes}
              isAnimating={isProcessing}
              step={animationStep}
            />
          </TabsContent>

          <TabsContent value="frequency" className="space-y-6">
            <FrequencyTable 
              data={frequencyData} 
              inputText={inputText}
              isVisible={animationStep >= 1}
            />
          </TabsContent>

          <TabsContent value="codebook" className="space-y-6">
            <CodebookDisplay 
              codes={huffmanCodes}
              tree={huffmanTree}
              isVisible={animationStep >= 3}
            />
          </TabsContent>

          <TabsContent value="audio" className="space-y-6">
            <AudioPlayback 
              originalText={inputText}
              encodedMessage={encodedMessage}
              decodedMessage={decodedMessage}
              codes={huffmanCodes}
              isPlaying={isPlaying}
              onTogglePlayback={togglePlayback}
            />
          </TabsContent>

          <TabsContent value="compression" className="space-y-6">
            <CompressionStats 
              originalText={inputText}
              encodedMessage={encodedMessage}
              codes={huffmanCodes}
              isVisible={animationStep >= 4}
            />
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <QuizMode 
              codes={huffmanCodes}
              tree={huffmanTree}
              isEnabled={animationStep >= 5}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
