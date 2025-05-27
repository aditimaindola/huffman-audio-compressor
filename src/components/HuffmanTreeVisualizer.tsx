
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HuffmanNode } from '@/utils/huffmanUtils';
import { Fullscreen } from 'lucide-react';
import TreeCanvas from './tree/TreeCanvas';
import TreeControls from './tree/TreeControls';

interface TreeVisualizerProps {
  tree: HuffmanNode | null;
  codes: {[key: string]: string};
  isAnimating: boolean;
  step: number;
}

const HuffmanTreeVisualizer: React.FC<TreeVisualizerProps> = ({ tree, codes, isAnimating, step }) => {
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getTreeDepth = (node: HuffmanNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
  };

  const highlightPathToSymbol = (symbol: string) => {
    if (!tree) return;

    const path: string[] = [];
    
    function findPath(node: HuffmanNode | null, targetSymbol: string): boolean {
      if (!node) return false;
      
      path.push(node.id);
      
      if (node.symbol === targetSymbol) {
        return true;
      }
      
      if (findPath(node.left, targetSymbol) || findPath(node.right, targetSymbol)) {
        return true;
      }
      
      path.pop();
      return false;
    }
    
    findPath(tree, symbol);
    setHighlightedPath(path);
  };

  const handleNodeClick = (symbol: string | null) => {
    setSelectedSymbol(selectedSymbol === symbol ? null : symbol);
    if (symbol) {
      highlightPathToSymbol(symbol);
    }
  };

  const handleZoomIn = () => setZoomLevel(Math.min(2, zoomLevel + 0.2));
  const handleZoomOut = () => setZoomLevel(Math.max(0.5, zoomLevel - 0.2));

  useEffect(() => {
    if (selectedSymbol) {
      highlightPathToSymbol(selectedSymbol);
    } else {
      setHighlightedPath([]);
    }
  }, [selectedSymbol, tree]);

  if (!tree) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Huffman Tree Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            Enter text and click "Analyze & Compress" to build the Huffman tree
          </div>
        </CardContent>
      </Card>
    );
  }

  const treeDepth = getTreeDepth(tree);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Huffman Tree Visualization
          </span>
          <div className="flex items-center gap-4">
            {selectedSymbol && (
              <span className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                Symbol '{selectedSymbol}' → Code: {codes[selectedSymbol]}
              </span>
            )}
            <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 border-0">
                  <Fullscreen className="w-4 h-4" />
                  Fullscreen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[98vw] max-h-[98vh] w-full h-full bg-gradient-to-br from-blue-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Huffman Tree Visualization - Fullscreen
                    </span>
                    {selectedSymbol && (
                      <span className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                        Symbol '{selectedSymbol}' → Code: {codes[selectedSymbol]}
                      </span>
                    )}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm text-gray-600 mb-4 p-3 bg-white/60 rounded-lg backdrop-blur-sm">
                    Click on leaf nodes (green circles) to highlight encoding paths. 
                    <span className="text-red-600 font-semibold">Red edges = 0</span>, 
                    <span className="text-green-600 font-semibold ml-2">Green edges = 1</span>
                  </div>
                  <TreeControls
                    zoomLevel={zoomLevel}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    treeDepth={treeDepth}
                  />
                  <TreeCanvas
                    tree={tree}
                    codes={codes}
                    highlightedPath={highlightedPath}
                    selectedSymbol={selectedSymbol}
                    isFullscreenMode={true}
                    zoomLevel={zoomLevel}
                    onNodeClick={handleNodeClick}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          Click on leaf nodes (green circles) to highlight encoding paths. 
          <span className="text-red-600 font-semibold">Red edges = 0</span>, 
          <span className="text-green-600 font-semibold ml-2">Green edges = 1</span>
        </div>
        <TreeCanvas
          tree={tree}
          codes={codes}
          highlightedPath={highlightedPath}
          selectedSymbol={selectedSymbol}
          isFullscreenMode={false}
          zoomLevel={1}
          onNodeClick={handleNodeClick}
        />
        
        {step >= 3 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Discrete Math Concepts:
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Binary Tree:</strong> Each internal node has exactly two children</li>
              <li>• <strong>Prefix-Free Codes:</strong> No code is a prefix of another</li>
              <li>• <strong>Greedy Algorithm:</strong> Always merge nodes with lowest frequencies</li>
              <li>• <strong>Optimal Substructure:</strong> Optimal tree contains optimal subtrees</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HuffmanTreeVisualizer;
