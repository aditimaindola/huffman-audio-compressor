
import React from 'react';
import { HuffmanNode } from '@/utils/huffmanUtils';

interface TreeNodeProps {
  node: HuffmanNode;
  x: number;
  y: number;
  nodeRadius: number;
  isHighlighted: boolean;
  selectedSymbol: string | null;
  codes: {[key: string]: string};
  isFullscreenMode: boolean;
  onNodeClick: (symbol: string | null) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  x,
  y,
  nodeRadius,
  isHighlighted,
  selectedSymbol,
  codes,
  isFullscreenMode,
  onNodeClick
}) => {
  const isLeaf = node.symbol !== null;

  return (
    <g>
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
      {isLeaf && (
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill="transparent"
          className="cursor-pointer"
          onClick={() => onNodeClick(node.symbol)}
        />
      )}
    </g>
  );
};

export default TreeNode;
