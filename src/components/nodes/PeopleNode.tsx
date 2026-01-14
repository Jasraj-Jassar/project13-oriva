import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { PersonData } from '../../models';

const nodeGradient = 'bg-gradient-to-br from-[#3C467B] via-[#50589C] via-[#636CCB] to-[#6E8CFB]';

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
        ${selected ? 'border-[#6E8CFB]' : 'border-[#50589C]'}
        ${nodeData.isDimmed ? 'opacity-30' : 'opacity-100'}
        ${nodeGradient}
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
