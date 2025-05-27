
import React from 'react';

interface TreeEdgeProps {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isHighlighted: boolean;
  edgeType: 'left' | 'right';
  isFullscreenMode: boolean;
  nodeRadius: number;
}

const TreeEdge: React.FC<TreeEdgeProps> = ({
  id,
  x1,
  y1,
  x2,
  y2,
  isHighlighted,
  edgeType,
  isFullscreenMode,
  nodeRadius
}) => {
  const color = edgeType === 'left' ? 
    (isHighlighted ? '#3b82f6' : '#f87171') : 
    (isHighlighted ? '#3b82f6' : '#10b981');
  const colorEnd = edgeType === 'left' ? 
    (isHighlighted ? '#1d4ed8' : '#dc2626') : 
    (isHighlighted ? '#1d4ed8' : '#059669');

  return (
    <g>
      <defs>
        <linearGradient id={`${edgeType}Edge-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={colorEnd} />
        </linearGradient>
      </defs>
      <line
        x1={x1}
        y1={y1 + nodeRadius}
        x2={x2}
        y2={y2 - nodeRadius}
        stroke={`url(#${edgeType}Edge-${id})`}
        strokeWidth={isHighlighted ? '4' : '3'}
        className="transition-all duration-300 drop-shadow-sm"
      />
      <text
        x={(x1 + x2) / 2 + (edgeType === 'left' ? -15 : 15)}
        y={(y1 + y2) / 2}
        className={`font-bold drop-shadow-md ${isFullscreenMode ? 'text-lg' : 'text-sm'}`}
        fill={`url(#${edgeType}Edge-${id})`}
      >
        {edgeType === 'left' ? '0' : '1'}
      </text>
    </g>
  );
};

export default TreeEdge;
