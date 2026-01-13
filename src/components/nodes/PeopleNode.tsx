import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { PersonData } from '../../models';

interface PeopleNodeData extends PersonData {
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

interface PeopleNodeProps {
  data: PeopleNodeData;
  selected?: boolean;
}

const PeopleNode = memo(({ data, selected }: PeopleNodeProps) => {
  const nodeData = data;
  
  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[180px] transition-all duration-200
        ${selected ? 'border-blue-400 ring-2 ring-blue-400/50' : 'border-purple-500/50'}
        ${nodeData.isDimmed ? 'opacity-30' : 'opacity-100'}
        ${nodeData.isHighlighted ? 'shadow-lg shadow-purple-500/30' : ''}
        bg-gradient-to-br from-purple-900/90 to-purple-800/90
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-purple-400 !border-2 !border-purple-600"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/50 text-purple-200 font-medium">
          Person
        </span>
      </div>
      
      <div className="text-white font-semibold text-sm">
        {nodeData.name || 'Unnamed'}
      </div>
      
      {nodeData.role && (
        <div className="text-purple-300 text-xs mt-1">
          {nodeData.role}
        </div>
      )}
      
      {nodeData.notes && (
        <div className="text-purple-400/70 text-xs mt-2 line-clamp-2">
          {nodeData.notes}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-purple-400 !border-2 !border-purple-600"
      />
    </div>
  );
});

PeopleNode.displayName = 'PeopleNode';

export default PeopleNode;
