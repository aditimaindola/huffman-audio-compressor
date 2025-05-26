
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FrequencyTableProps {
  data: Array<{symbol: string, frequency: number}>;
  inputText: string;
  isVisible: boolean;
}

const FrequencyTable: React.FC<FrequencyTableProps> = ({ data, inputText, isVisible }) => {
  const totalChars = inputText.length;
  const maxFrequency = Math.max(...data.map(item => item.frequency));

  if (!isVisible || data.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Frequency Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            Frequency analysis will appear here after processing
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Frequency Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frequency Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Symbol Frequencies</h3>
            <div className="space-y-3">
              {data.map((item, index) => (
                <div key={item.symbol} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-lg bg-gray-100 px-2 py-1 rounded">
                      {item.symbol === ' ' ? '⎵' : item.symbol}
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.frequency} / {totalChars} ({((item.frequency / totalChars) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress 
                    value={(item.frequency / maxFrequency) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Total Characters</div>
                <div className="text-2xl font-bold text-blue-800">{totalChars}</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Unique Symbols</div>
                <div className="text-2xl font-bold text-green-800">{data.length}</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Most Frequent</div>
                <div className="text-xl font-bold text-purple-800">
                  '{data[0]?.symbol === ' ' ? '⎵' : data[0]?.symbol}' ({data[0]?.frequency})
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Least Frequent</div>
                <div className="text-xl font-bold text-orange-800">
                  '{data[data.length - 1]?.symbol === ' ' ? '⎵' : data[data.length - 1]?.symbol}' ({data[data.length - 1]?.frequency})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Algorithm Step 1: Frequency Analysis</h4>
          <p className="text-sm text-gray-600 mb-2">
            We count how often each symbol appears in the input. This frequency information is crucial 
            for building an optimal Huffman tree where more frequent symbols get shorter codes.
          </p>
          <div className="text-xs text-gray-500">
            <strong>Time Complexity:</strong> O(n) where n is the length of input text<br/>
            <strong>Space Complexity:</strong> O(k) where k is the number of unique symbols
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FrequencyTable;
