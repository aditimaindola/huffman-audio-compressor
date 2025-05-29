
import React from 'react';
import { HuffmanNode } from '@/utils/huffmanUtils';
import TreeNode from './TreeNode';
import TreeEdge from './TreeEdge';

interface TreeCanvasProps {
  tree: HuffmanNode | null;
  codes: {[key: string]: string};
  highlightedPath: string[];
  selectedSymbol: string | null;
  isFullscreenMode: boolean;
  zoomLevel: number;
  onNodeClick: (symbol: string | null) => void;
}

const TreeCanvas: React.FC<TreeCanvasProps> = ({
  tree,
  codes,
  highlightedPath,
  selectedSymbol,
  isFullscreenMode,
  zoomLevel,
  onNodeClick
}) => {
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

  const renderNode = (node: HuffmanNode | null, x: number, y: number, level: number): JSX.Element[] => {
    if (!node) return [];

    const elements: JSX.Element[] = [];
    const nodeRadius = isFullscreenMode ? 35 : 25;
    const treeDimensions = getTreeDimensions(tree);
    const horizontalSpacing = isFullscreenMode 
      ? Math.max(150, treeDimensions.width / Math.pow(2, level + 1))
      : Math.max(80, 300 / Math.pow(2, level));
    const verticalSpacing = isFullscreenMode ? 120 : 80;

    const isHighlighted = highlightedPath.includes(node.id);
    
    elements.push(
      <TreeNode
        key={node.id}
        node={node}
        x={x}
        y={y}
        nodeRadius={nodeRadius}
        isHighlighted={isHighlighted}
        selectedSymbol={selectedSymbol}
        codes={codes}
        isFullscreenMode={isFullscreenMode}
        onNodeClick={onNodeClick}
      />
    );

    if (node.left) {
      const leftX = x - horizontalSpacing;
      const leftY = y + verticalSpacing;
      
      elements.push(
        <TreeEdge
          key={`left-edge-${node.id}`}
          id={node.id}
          x1={x}
          y1={y}
          x2={leftX}
          y2={leftY}
          isHighlighted={highlightedPath.includes(node.left.id)}
          edgeType="left"
          isFullscreenMode={isFullscreenMode}
          nodeRadius={nodeRadius}
        />
      );
      
      elements.push(...renderNode(node.left, leftX, leftY, level + 1));
    }

    if (node.right) {
      const rightX = x + horizontalSpacing;
      const rightY = y + verticalSpacing;
      
      elements.push(
        <TreeEdge
          key={`right-edge-${node.id}`}
          id={node.id}
          x1={x}
          y1={y}
          x2={rightX}
          y2={rightY}
          isHighlighted={highlightedPath.includes(node.right.id)}
          edgeType="right"
          isFullscreenMode={isFullscreenMode}
          nodeRadius={nodeRadius}
        />
      );
      
      elements.push(...renderNode(node.right, rightX, rightY, level + 1));
    }

    return elements;
  };

  if (!tree) return null;

  const treeDimensions = getTreeDimensions(tree);
  const svgWidth = isFullscreenMode ? treeDimensions.width * zoomLevel : 800;
  const svgHeight = isFullscreenMode ? treeDimensions.height * zoomLevel : 400;
  const centerX = svgWidth / 2;

  return (
    <div className={`w-full ${isFullscreenMode ? 'h-full' : ''} overflow-auto`}>
      <div className={`${isFullscreenMode ? 'max-h-[calc(100vh-200px)] overflow-auto' : ''}`}>
        <svg 
          width={svgWidth} 
          height={svgHeight} 
          className="border-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-lg bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 backdrop-blur-sm shadow-xl"
          style={{ minWidth: '100%' }}
        >
          {renderNode(tree, centerX, 60, 0)}
        </svg>
      </div>
    </div>
  );
};

export default TreeCanvas;
