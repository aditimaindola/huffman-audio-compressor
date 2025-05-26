
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HuffmanNode } from '@/utils/huffmanUtils';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodebookDisplayProps {
  codes: {[key: string]: string};
  tree: HuffmanNode | null;
  isVisible: boolean;
}

const CodebookDisplay: React.FC<CodebookDisplayProps> = ({ codes, tree, isVisible }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const { toast } = useToast();

  if (!isVisible || Object.keys(codes).length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Huffman Codebook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            Huffman codes will appear here after tree construction
          </div>
        </CardContent>
      </Card>
    );
  }

  const copyCodebook = () => {
    const codebookText = Object.entries(codes)
      .map(([symbol, code]) => `'${symbol === ' ' ? 'SPACE' : symbol}' → ${code}`)
      .join('\n');
    
    navigator.clipboard.writeText(codebookText);
    toast({
      title: "Copied!",
      description: "Codebook copied to clipboard",
    });
  };

  const downloadCodebook = () => {
    const codebookData = {
      timestamp: new Date().toISOString(),
      codes: codes,
      metadata: {
        totalSymbols: Object.keys(codes).length,
        averageCodeLength: Object.values(codes).reduce((sum, code) => sum + code.length, 0) / Object.keys(codes).length
      }
    };
    
    const blob = new Blob([JSON.stringify(codebookData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'huffman-codebook.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPathToSymbol = (symbol: string): string => {
    if (!tree) return '';
    
    const path: string[] = [];
    
    function findPath(node: HuffmanNode | null, targetSymbol: string): boolean {
      if (!node) return false;
      
      if (node.symbol === targetSymbol) {
        return true;
      }
      
      if (node.left && findPath(node.left, targetSymbol)) {
        path.unshift('0');
        return true;
      }
      
      if (node.right && findPath(node.right, targetSymbol)) {
        path.unshift('1');
        return true;
      }
      
      return false;
    }
    
    findPath(tree, symbol);
    return path.join('');
  };

  // Sort codes by length, then alphabetically
  const sortedCodes = Object.entries(codes).sort((a, b) => {
    if (a[1].length !== b[1].length) {
      return a[1].length - b[1].length;
    }
    return a[0].localeCompare(b[0]);
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Huffman Codebook</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyCodebook}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCodebook}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Codebook Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Symbol → Binary Code Mapping</h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sortedCodes.map(([symbol, code]) => (
                <div
                  key={symbol}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSymbol === symbol 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedSymbol(selectedSymbol === symbol ? null : symbol)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xl bg-white px-3 py-1 rounded border">
                      {symbol === ' ' ? '⎵' : symbol}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="font-mono text-lg text-blue-600 font-bold">
                      {code}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {code.length} bit{code.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Code Statistics</h3>
            
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Total Symbols</div>
                <div className="text-2xl font-bold text-blue-800">{Object.keys(codes).length}</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Shortest Code</div>
                <div className="text-xl font-bold text-green-800 font-mono">
                  {Math.min(...Object.values(codes).map(code => code.length))} bits
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Longest Code</div>
                <div className="text-xl font-bold text-purple-800 font-mono">
                  {Math.max(...Object.values(codes).map(code => code.length))} bits
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Average Length</div>
                <div className="text-xl font-bold text-orange-800 font-mono">
                  {(Object.values(codes).reduce((sum, code) => sum + code.length, 0) / Object.keys(codes).length).toFixed(2)} bits
                </div>
              </div>
            </div>

            {/* Selected Symbol Details */}
            {selectedSymbol && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Symbol Details: '{selectedSymbol === ' ' ? '⎵' : selectedSymbol}'
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>Code: <span className="font-mono font-bold">{codes[selectedSymbol]}</span></div>
                  <div>Length: {codes[selectedSymbol].length} bits</div>
                  <div>Tree Path: {getPathToSymbol(selectedSymbol) || 'Root'}</div>
                  <div className="text-xs text-blue-600 mt-2">
                    Click other symbols to compare their codes
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Properties */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Prefix-Free Property Verification</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>✓ No code is a prefix of another:</strong> This ensures unambiguous decoding.
              You can concatenate codes without delimiters and still decode uniquely.
            </p>
            <p>
              <strong>✓ Variable-length encoding:</strong> More frequent symbols get shorter codes,
              leading to better compression than fixed-length encoding.
            </p>
            <p>
              <strong>✓ Optimal prefix-free code:</strong> Huffman's algorithm produces the optimal
              variable-length prefix-free code for given symbol frequencies.
            </p>
          </div>
        </div>

        {/* Usage Example */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Decoding Example</h4>
          <div className="text-sm text-green-700">
            <p className="mb-2">To decode a binary message, traverse the tree:</p>
            <ul className="space-y-1 text-xs">
              <li>• Start at root for each symbol</li>
              <li>• 0 = go left, 1 = go right</li>
              <li>• When you reach a leaf, output the symbol and return to root</li>
              <li>• Repeat until all bits are consumed</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodebookDisplay;
