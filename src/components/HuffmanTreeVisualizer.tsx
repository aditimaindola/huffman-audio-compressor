
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HuffmanNode } from '@/utils/huffmanUtils';

interface TreeVisualizerProps {
  tree: HuffmanNode | null;
  codes: {[key: string]: string};
  isAnimating: boolean;
  step: number;
}

const HuffmanTreeVisualizer: React.FC<TreeVisualizerProps> = ({ tree, codes, isAnimating, step }) => {
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const renderNode = (node: HuffmanNode | null, x: number, y: number, level: number): JSX.Element[] => {
    if (!node) return [];

    const elements: JSX.Element[] = [];
    const nodeRadius = 25;
    const horizontalSpacing = Math.max(80, 300 / Math.pow(2, level));
    const verticalSpacing = 80;

    // Node circle
    const isHighlighted = highlightedPath.includes(node.id);
    const isLeaf = node.symbol !== null;
    
    elements.push(
      <g key={node.id}>
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={isHighlighted ? '#3b82f6' : isLeaf ? '#10b981' : '#6b7280'}
          stroke={isHighlighted ? '#1d4ed8' : '#374151'}
          strokeWidth="2"
          className="transition-all duration-300"
        />
        <text
          x={x}
          y={y - 5}
          textAnchor="middle"
          className="text-white text-sm font-bold pointer-events-none"
        >
          {node.symbol || ''}
        </text>
        <text
          x={x}
          y={y + 10}
          textAnchor="middle"
          className="text-white text-xs pointer-events-none"
        >
          {node.frequency}
        </text>
        {isLeaf && selectedSymbol === node.symbol && (
          <text
            x={x}
            y={y + 40}
            textAnchor="middle"
            className="text-blue-600 text-xs font-bold pointer-events-none"
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
      
      // Left edge
      elements.push(
        <g key={`left-edge-${node.id}`}>
          <line
            x1={x}
            y1={y + nodeRadius}
            x2={leftX}
            y2={leftY - nodeRadius}
            stroke={highlightedPath.includes(node.left.id) ? '#3b82f6' : '#6b7280'}
            strokeWidth={highlightedPath.includes(node.left.id) ? '3' : '2'}
            className="transition-all duration-300"
          />
          <text
            x={(x + leftX) / 2 - 10}
            y={(y + leftY) / 2}
            className="text-red-600 text-sm font-bold"
          >
            0
          </text>
        </g>
      );
      
      elements.push(...renderNode(node.left, leftX, leftY, level + 1));
    }

    if (node.right) {
      const rightX = x + horizontalSpacing;
      const rightY = y + verticalSpacing;
      
      // Right edge
      elements.push(
        <g key={`right-edge-${node.id}`}>
          <line
            x1={x}
            y1={y + nodeRadius}
            x2={rightX}
            y2={rightY - nodeRadius}
            stroke={highlightedPath.includes(node.right.id) ? '#3b82f6' : '#6b7280'}
            strokeWidth={highlightedPath.includes(node.right.id) ? '3' : '2'}
            className="transition-all duration-300"
          />
          <text
            x={(x + rightX) / 2 + 10}
            y={(y + rightY) / 2}
            className="text-green-600 text-sm font-bold"
          >
            1
          </text>
        </g>
      );
      
      elements.push(...renderNode(node.right, rightX, rightY, level + 1));
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
          {selectedSymbol && (
            <span className="text-sm text-blue-600">
              Symbol '{selectedSymbol}' → Code: {codes[selectedSymbol]}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          Click on leaf nodes (green circles) to highlight encoding paths. 
          Red edges = 0, Green edges = 1
        </div>
        <div className="w-full overflow-auto">
          <svg width="800" height="400" className="border rounded-lg bg-gray-50">
            {renderNode(tree, 400, 50, 0)}
          </svg>
        </div>
        
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
