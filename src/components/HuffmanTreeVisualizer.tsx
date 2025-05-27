
import React, { useEffect, useState } from 'react';
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

const HuffmanTreeVisualizer: React.FC<TreeVisualizerProps> = ({ tree, codes, isAnimating, step }) => {
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getTreeDimensions = (node: HuffmanNode | null): { width: number; height: number; depth: number } => {
    if (!node) return { width: 0, height: 0, depth: 0 };
    
    const getDepth = (n: HuffmanNode | null): number => {
      if (!n) return 0;
      return 1 + Math.max(getDepth(n.left), getDepth(n.right));
    };
    
    const getLeafCount = (n: HuffmanNode | null): number => {
      if (!n) return 0;
      if (!n.left && !n.right) return 1;
      return getLeafCount(n.left) + getLeafCount(n.right);
    };
    
    const depth = getDepth(node);
    const leafCount = getLeafCount(node);
    const width = Math.max(800, leafCount * 120);
    const height = Math.max(400, depth * 120);
    
    return { width, height, depth };
  };

  const renderNode = (node: HuffmanNode | null, x: number, y: number, level: number, isFullscreenMode: boolean = false): JSX.Element[] => {
    if (!node) return [];

    const elements: JSX.Element[] = [];
    const nodeRadius = isFullscreenMode ? 35 : 25;
    const treeDimensions = getTreeDimensions(tree);
    const horizontalSpacing = isFullscreenMode 
      ? Math.max(150, treeDimensions.width / Math.pow(2, level + 1))
      : Math.max(80, 300 / Math.pow(2, level));
    const verticalSpacing = isFullscreenMode ? 120 : 80;

    // Node circle with gradient theme
    const isHighlighted = highlightedPath.includes(node.id);
    const isLeaf = node.symbol !== null;
    
    elements.push(
      <g key={node.id}>
        <defs>
          <linearGradient id={`nodeGradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isHighlighted ? '#3b82f6' : isLeaf ? '#10b981' : '#8b5cf6'} />
            <stop offset="100%" stopColor={isHighlighted ? '#1d4ed8' : isLeaf ? '#059669' : '#7c3aed'} />
          </linearGradient>
        </defs>
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={`url(#nodeGradient-${node.id})`}
          stroke={isHighlighted ? '#1d4ed8' : '#374151'}
          strokeWidth="2"
          className="transition-all duration-300 drop-shadow-lg"
        />
        <text
          x={x}
          y={y - 5}
          textAnchor="middle"
          className={`text-white font-bold pointer-events-none ${isFullscreenMode ? 'text-lg' : 'text-sm'}`}
        >
          {node.symbol || ''}
        </text>
        <text
          x={x}
          y={y + 10}
          textAnchor="middle"
          className={`text-white pointer-events-none ${isFullscreenMode ? 'text-base' : 'text-xs'}`}
        >
          {node.frequency}
        </text>
        {isLeaf && selectedSymbol === node.symbol && (
          <text
            x={x}
            y={y + (isFullscreenMode ? 60 : 40)}
            textAnchor="middle"
            className={`text-blue-600 font-bold pointer-events-none ${isFullscreenMode ? 'text-lg' : 'text-xs'}`}
          >
            {codes[node.symbol!] || ''}
          </text>
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
          className="cursor-pointer"
          onClick={() => {
            setSelectedSymbol(selectedSymbol === node.symbol ? null : node.symbol);
            if (node.symbol) {
              highlightPathToSymbol(node.symbol);
            }
          }}
        />
      );
    }

    // Recursive rendering for children
    if (node.left) {
      const leftX = x - horizontalSpacing;
      const leftY = y + verticalSpacing;
      
      // Left edge with gradient
      elements.push(
        <g key={`left-edge-${node.id}`}>
          <defs>
            <linearGradient id={`leftEdge-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={highlightedPath.includes(node.left.id) ? '#3b82f6' : '#f87171'} />
              <stop offset="100%" stopColor={highlightedPath.includes(node.left.id) ? '#1d4ed8' : '#dc2626'} />
            </linearGradient>
          </defs>
          <line
            x1={x}
            y1={y + nodeRadius}
            x2={leftX}
            y2={leftY - nodeRadius}
            stroke={`url(#leftEdge-${node.id})`}
            strokeWidth={highlightedPath.includes(node.left.id) ? '4' : '3'}
            className="transition-all duration-300 drop-shadow-sm"
          />
          <text
            x={(x + leftX) / 2 - 15}
            y={(y + leftY) / 2}
            className={`font-bold drop-shadow-md ${isFullscreenMode ? 'text-lg' : 'text-sm'}`}
            fill="url(#leftEdge-${node.id})"
          >
            0
          </text>
        </g>
      );
      
      elements.push(...renderNode(node.left, leftX, leftY, level + 1, isFullscreenMode));
    }

    if (node.right) {
      const rightX = x + horizontalSpacing;
      const rightY = y + verticalSpacing;
      
      // Right edge with gradient
      elements.push(
        <g key={`right-edge-${node.id}`}>
          <defs>
            <linearGradient id={`rightEdge-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={highlightedPath.includes(node.right.id) ? '#3b82f6' : '#10b981'} />
              <stop offset="100%" stopColor={highlightedPath.includes(node.right.id) ? '#1d4ed8' : '#059669'} />
            </linearGradient>
          </defs>
          <line
            x1={x}
            y1={y + nodeRadius}
            x2={rightX}
            y2={rightY - nodeRadius}
            stroke={`url(#rightEdge-${node.id})`}
            strokeWidth={highlightedPath.includes(node.right.id) ? '4' : '3'}
            className="transition-all duration-300 drop-shadow-sm"
          />
          <text
            x={(x + rightX) / 2 + 15}
            y={(y + rightY) / 2}
            className={`font-bold drop-shadow-md ${isFullscreenMode ? 'text-lg' : 'text-sm'}`}
            fill="url(#rightEdge-${node.id})"
          >
            1
          </text>
        </g>
      );
      
      elements.push(...renderNode(node.right, rightX, rightY, level + 1, isFullscreenMode));
    }

    return elements;
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

  useEffect(() => {
    if (selectedSymbol) {
      highlightPathToSymbol(selectedSymbol);
    } else {
      setHighlightedPath([]);
    }
  }, [selectedSymbol, tree]);

  const TreeVisualization = ({ isFullscreenMode = false }: { isFullscreenMode?: boolean }) => {
    const treeDimensions = getTreeDimensions(tree);
    const svgWidth = isFullscreenMode ? treeDimensions.width * zoomLevel : 800;
    const svgHeight = isFullscreenMode ? treeDimensions.height * zoomLevel : 400;
    const centerX = svgWidth / 2;
    
    return (
      <div className={`w-full ${isFullscreenMode ? 'h-full' : ''} overflow-auto`}>
        {isFullscreenMode && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.2))}
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.2))}
              disabled={zoomLevel >= 2}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <div className="text-sm text-gray-600 ml-4">
              Tree depth: {treeDimensions.depth} levels
            </div>
          </div>
        )}
        <div className={`${isFullscreenMode ? 'max-h-[calc(100vh-200px)] overflow-auto' : ''}`}>
          <svg 
            width={svgWidth} 
            height={svgHeight} 
            className="border-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-lg bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 backdrop-blur-sm shadow-xl"
            style={{ minWidth: '100%' }}
          >
            {tree && renderNode(tree, centerX, 60, 0, isFullscreenMode)}
          </svg>
        </div>
      </div>
    );
  };

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
                  <TreeVisualization isFullscreenMode={true} />
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
        <TreeVisualization />
        
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
