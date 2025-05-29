import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HuffmanNode } from '@/utils/huffmanUtils';
import { Fullscreen, ZoomIn, ZoomOut } from 'lucide-react';

interface TreeVisualizerProps {
  tree: HuffmanNode | null;
  codes: {[key: string]: string};
  isAnimating: boolean;
  step: number;
}

interface TreeDimensions {
  width: number;
  height: number;
  leafCount: number;
}

const HuffmanTreeVisualizer: React.FC<TreeVisualizerProps> = ({ tree, codes, isAnimating, step }) => {
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate tree dimensions
  const calculateTreeDimensions = (node: HuffmanNode | null, level: number = 0): TreeDimensions => {
    if (!node) return { width: 0, height: 0, leafCount: 0 };

    if (!node.left && !node.right) {
      return { width: 1, height: level + 1, leafCount: 1 };
    }

    const leftDim = calculateTreeDimensions(node.left, level + 1);
    const rightDim = calculateTreeDimensions(node.right, level + 1);

    return {
      width: leftDim.width + rightDim.width,
      height: Math.max(leftDim.height, rightDim.height),
      leafCount: leftDim.leafCount + rightDim.leafCount
    };
  };

  const renderNode = (
    node: HuffmanNode | null, 
    x: number, 
    y: number, 
    level: number, 
    totalLevels: number,
    levelWidth: number,
    isFullscreenMode: boolean = false
  ): JSX.Element[] => {
    if (!node) return [];

    const elements: JSX.Element[] = [];
    const nodeRadius = 25 * scale;
    const verticalGap = (isFullscreenMode ? 600 : 400) / (totalLevels + 1);
    
    // Node circle
    const isHighlighted = highlightedPath.includes(node.id);
    const isLeaf = !node.left && !node.right;
    
    elements.push(
      <g key={node.id} className="transition-transform duration-300">
        {/* Highlight glow effect for selected path */}
        {isHighlighted && (
          <circle
            cx={x}
            cy={y}
            r={nodeRadius + 5}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            className="animate-pulse"
          />
        )}
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={isHighlighted ? '#3b82f6' : isLeaf ? '#10b981' : '#6b7280'}
          stroke={isHighlighted ? '#1d4ed8' : '#374151'}
          strokeWidth="2"
          className={`transition-all duration-300 ${isLeaf ? 'hover:scale-110 cursor-pointer' : ''}`}
        />
        <text
          x={x}
          y={y - nodeRadius/3}
          textAnchor="middle"
          className={`text-white font-bold pointer-events-none ${isFullscreenMode ? 'text-lg' : 'text-base'}`}
          style={{ fontSize: `${12 * scale}px` }}
        >
          {node.symbol || ''}
        </text>
        <text
          x={x}
          y={y + nodeRadius/3}
          textAnchor="middle"
          className={`text-white pointer-events-none ${isFullscreenMode ? 'text-base' : 'text-sm'}`}
          style={{ fontSize: `${10 * scale}px` }}
        >
          {node.frequency}
        </text>
        
        {/* Floating info box for selected leaf nodes */}
        {isLeaf && isHighlighted && selectedSymbol === node.symbol && (
          <g>
            <rect
              x={x + nodeRadius * 1.5}
              y={y - nodeRadius * 2}
              width={nodeRadius * 6}
              height={nodeRadius * 2}
              rx="5"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="2"
              className="filter drop-shadow-lg"
            />
            <text
              x={x + nodeRadius * 1.8}
              y={y - nodeRadius}
              className="text-blue-600 font-mono"
              style={{ fontSize: `${11 * scale}px` }}
            >
              Code: {codes[node.symbol || '']}
            </text>
          </g>
        )}
      </g>
    );

    // Add click handler for leaf nodes
    if (isLeaf) {
      elements.push(
        <circle
          key={`clickable-${node.id}`}
          cx={x}
          cy={y}
          r={nodeRadius}
          fill="transparent"
          className="cursor-pointer transition-transform duration-300 hover:scale-110"
          onClick={() => {
            setSelectedSymbol(selectedSymbol === node.symbol ? null : node.symbol);
            if (node.symbol) highlightPathToSymbol(node.symbol);
          }}
        />
      );
    }

    // Calculate positions for children
    if (node.left || node.right) {
      const nextLevelWidth = levelWidth / 2;
      
      if (node.left) {
        const leftX = x - nextLevelWidth;
        const leftY = y + verticalGap;
        
        elements.push(
          <g key={`left-edge-${node.id}`}>
            <line
              x1={x}
              y1={y + nodeRadius}
              x2={leftX}
              y2={leftY - nodeRadius}
              stroke={highlightedPath.includes(node.left.id) ? '#60a5fa' : '#6b7280'}
              strokeWidth={highlightedPath.includes(node.left.id) ? 3 : 2 * scale}
              className="transition-all duration-300"
              strokeDasharray={highlightedPath.includes(node.left.id) ? "0" : ""}
            />
            <text
              x={(x + leftX) / 2 - 10 * scale}
              y={(y + leftY) / 2}
              className={`font-bold ${highlightedPath.includes(node.left.id) ? 'text-blue-600 font-bold text-lg' : 'text-red-600'}`}
              style={{ fontSize: `${highlightedPath.includes(node.left.id) ? 14 * scale : 12 * scale}px` }}
            >
              0
            </text>
          </g>
        );
        
        elements.push(...renderNode(
          node.left, 
          leftX, 
          leftY, 
          level + 1, 
          totalLevels,
          nextLevelWidth,
          isFullscreenMode
        ));
      }

      if (node.right) {
        const rightX = x + nextLevelWidth;
        const rightY = y + verticalGap;
        
        elements.push(
          <g key={`right-edge-${node.id}`}>
            <line
              x1={x}
              y1={y + nodeRadius}
              x2={rightX}
              y2={rightY - nodeRadius}
              stroke={highlightedPath.includes(node.right.id) ? '#60a5fa' : '#6b7280'}
              strokeWidth={highlightedPath.includes(node.right.id) ? 3 : 2 * scale}
              className="transition-all duration-300"
              strokeDasharray={highlightedPath.includes(node.right.id) ? "0" : ""}
            />
            <text
              x={(x + rightX) / 2 + 10 * scale}
              y={(y + rightY) / 2}
              className={`font-bold ${highlightedPath.includes(node.right.id) ? 'text-blue-600 font-bold text-lg' : 'text-green-600'}`}
              style={{ fontSize: `${highlightedPath.includes(node.right.id) ? 14 * scale : 12 * scale}px` }}
            >
              1
            </text>
          </g>
        );
        
        elements.push(...renderNode(
          node.right, 
          rightX, 
          rightY, 
          level + 1, 
          totalLevels,
          nextLevelWidth,
          isFullscreenMode
        ));
      }
    }

    return elements;
  };

  const highlightPathToSymbol = (symbol: string) => {
    if (!tree) return;
    const path: string[] = [];
    
    const findPath = (node: HuffmanNode | null, targetSymbol: string): boolean => {
      if (!node) return false;
      path.push(node.id);
      if (node.symbol === targetSymbol) return true;
      if (findPath(node.left, targetSymbol) || findPath(node.right, targetSymbol)) return true;
      path.pop();
      return false;
    };
    
    findPath(tree, symbol);
    setHighlightedPath(path);
  };

  const TreeVisualization = ({ isFullscreenMode = false }: { isFullscreenMode?: boolean }) => {
    const dimensions = tree ? calculateTreeDimensions(tree) : { width: 0, height: 0, leafCount: 0 };
    const padding = 50 * scale;
    
    // Calculate SVG dimensions based on tree size
    const baseWidth = Math.max(800, dimensions.leafCount * 100);
    const baseHeight = dimensions.height * 100;
    
    const width = baseWidth * scale + (padding * 2);
    const height = baseHeight * scale + (padding * 2);
    
    return (
      <div className="relative w-full" ref={containerRef}>
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
            className="bg-white"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(s => Math.min(2, s + 0.1))}
            className="bg-white"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
        <div className="w-full overflow-auto border rounded-lg bg-gray-50">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform={`translate(${padding}, ${padding})`}>
              {tree && renderNode(
                tree,
                (width - padding * 2) / 2,
                0,
                0,
                dimensions.height,
                (width - padding * 2) / 2,
                isFullscreenMode
              )}
            </g>
          </svg>
        </div>
      </div>
    );
  };

  if (!tree) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Huffman Tree Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            Enter text and click "Analyze & Compress" to build the Huffman tree
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Huffman Tree Visualization</span>
          <div className="flex items-center gap-4">
            {selectedSymbol && (
              <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                Symbol '{selectedSymbol === ' ' ? '⎵' : selectedSymbol}' → Code: <span className="font-mono font-bold">{codes[selectedSymbol]}</span>
              </span>
            )}
            <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Fullscreen className="w-4 h-4" />
                  Fullscreen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Huffman Tree Visualization - Fullscreen</span>
                    {selectedSymbol && (
                      <span className="text-sm text-blue-600">
                        Symbol '{selectedSymbol}' → Code: {codes[selectedSymbol]}
                      </span>
                    )}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm text-gray-600 mb-4">
                    Click on leaf nodes (green circles) to highlight encoding paths. 
                    Red edges = 0, Green edges = 1
                  </div>
                  <TreeVisualization isFullscreenMode={true} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          Click on leaf nodes (green circles) to highlight encoding paths. 
          Red edges = 0, Green edges = 1
        </div>
        <TreeVisualization />
        
        {step >= 3 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Discrete Math Concepts:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
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
