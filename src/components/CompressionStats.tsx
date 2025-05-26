
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { calculateCompressionRatio } from '@/utils/huffmanUtils';

interface CompressionStatsProps {
  originalText: string;
  encodedMessage: string;
  codes: {[key: string]: string};
  isVisible: boolean;
}

const CompressionStats: React.FC<CompressionStatsProps> = ({
  originalText,
  encodedMessage,
  codes,
  isVisible
}) => {
  if (!isVisible || !originalText || !encodedMessage) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Compression Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            Compression statistics will appear here after encoding
          </div>
        </CardContent>
      </Card>
    );
  }

  const originalBits = originalText.length * 8; // ASCII encoding
  const compressedBits = encodedMessage.length;
  const compressionRatio = calculateCompressionRatio(originalText, encodedMessage);
  const spaceSaved = originalBits - compressedBits;
  const spaceSavedPercent = (spaceSaved / originalBits) * 100;

  // Calculate average code length
  const totalCodeLength = originalText.split('').reduce((sum, char) => {
    return sum + (codes[char]?.length || 0);
  }, 0);
  const averageCodeLength = totalCodeLength / originalText.length;

  // Calculate theoretical minimum (entropy)
  const frequency: {[key: string]: number} = {};
  for (const char of originalText) {
    frequency[char] = (frequency[char] || 0) + 1;
  }
  
  let entropy = 0;
  for (const [char, freq] of Object.entries(frequency)) {
    const probability = freq / originalText.length;
    entropy -= probability * Math.log2(probability);
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Compression Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-800">{originalBits}</div>
            <div className="text-sm text-blue-600">Original Size (bits)</div>
            <div className="text-xs text-gray-500">{originalText.length} chars × 8 bits</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-800">{compressedBits}</div>
            <div className="text-sm text-green-600">Compressed Size (bits)</div>
            <div className="text-xs text-gray-500">Huffman encoded</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-800">{compressionRatio.toFixed(2)}:1</div>
            <div className="text-sm text-purple-600">Compression Ratio</div>
            <div className="text-xs text-gray-500">Original ÷ Compressed</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-800">{spaceSavedPercent.toFixed(1)}%</div>
            <div className="text-sm text-orange-600">Space Saved</div>
            <div className="text-xs text-gray-500">{spaceSaved} bits saved</div>
          </div>
        </div>

        {/* Visual Comparison */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Size Comparison</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Original (ASCII)</span>
              <span>{originalBits} bits</span>
            </div>
            <Progress value={100} className="h-4" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Huffman Compressed</span>
              <span>{compressedBits} bits</span>
            </div>
            <Progress value={(compressedBits / originalBits) * 100} className="h-4" />
          </div>
        </div>

        {/* Advanced Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Encoding Efficiency</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Average Code Length:</span>
                <span className="font-mono">{averageCodeLength.toFixed(2)} bits</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Theoretical Minimum (Entropy):</span>
                <span className="font-mono">{entropy.toFixed(2)} bits</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Efficiency:</span>
                <span className="font-mono">{((entropy / averageCodeLength) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Code Length Distribution</h3>
            
            <div className="space-y-2">
              {Object.entries(codes)
                .sort((a, b) => a[1].length - b[1].length)
                .map(([symbol, code]) => (
                  <div key={symbol} className="flex items-center gap-2">
                    <span className="font-mono w-8 text-center bg-gray-100 rounded">
                      {symbol === ' ' ? '⎵' : symbol}
                    </span>
                    <span className="font-mono text-sm flex-1">{code}</span>
                    <span className="text-xs text-gray-500">{code.length} bits</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Formula Explanation */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Compression Formulas</h4>
          
          <div className="space-y-2 text-sm">
            <div>
              <strong>Compression Ratio =</strong> Original Size ÷ Compressed Size = {originalBits} ÷ {compressedBits} = <span className="text-blue-600 font-bold">{compressionRatio.toFixed(2)}:1</span>
            </div>
            
            <div>
              <strong>Space Saved =</strong> ((Original - Compressed) ÷ Original) × 100% = <span className="text-green-600 font-bold">{spaceSavedPercent.toFixed(1)}%</span>
            </div>
            
            <div>
              <strong>Entropy =</strong> -Σ(p(x) × log₂(p(x))) = <span className="text-purple-600 font-bold">{entropy.toFixed(2)} bits</span>
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Performance Analysis</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>
              <strong>Good compression!</strong> The Huffman algorithm achieved {compressionRatio.toFixed(2)}:1 ratio, 
              saving {spaceSavedPercent.toFixed(1)}% of storage space.
            </p>
            <p>
              The average code length ({averageCodeLength.toFixed(2)} bits) is close to the theoretical 
              minimum ({entropy.toFixed(2)} bits), indicating efficient encoding.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompressionStats;
