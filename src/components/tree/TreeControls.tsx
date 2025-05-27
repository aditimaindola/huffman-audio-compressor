
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface TreeControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  treeDepth: number;
}

const TreeControls: React.FC<TreeControlsProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  treeDepth
}) => {
  return (
    <div className="flex items-center gap-2 mb-4 p-2 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg">
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
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
        onClick={onZoomIn}
        disabled={zoomLevel >= 2}
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      <div className="text-sm text-gray-600 ml-4">
        Tree depth: {treeDepth} levels
      </div>
    </div>
  );
};

export default TreeControls;
