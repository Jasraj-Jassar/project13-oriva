import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { StrategyData, StrategyPriority, StrategyStatus } from '../../models';

interface StrategyNodeData extends StrategyData {
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

interface StrategyNodeProps {
  data: StrategyNodeData;
  selected?: boolean;
}

const nodeGradient = 'bg-gradient-to-br from-[#3C467B] via-[#50589C] via-[#636CCB] to-[#6E8CFB]';

const priorityColors: Record<StrategyPriority, { bg: string; text: string; label: string }> = {
  critical: { bg: 'bg-[#3C467B]/70', text: 'text-[#F8FAFC]', label: 'Critical' },
  high: { bg: 'bg-[#50589C]/70', text: 'text-[#F8FAFC]', label: 'High' },
  medium: { bg: 'bg-[#636CCB]/70', text: 'text-[#F8FAFC]', label: 'Medium' },
  low: { bg: 'bg-[#6E8CFB]/70', text: 'text-[#F8FAFC]', label: 'Low' },
};

const statusLabels: Record<StrategyStatus, string> = {
  planning: 'Planning',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
};

const StrategyNode = memo(({ data, selected }: StrategyNodeProps) => {
  const nodeData = data;
  const priority = priorityColors[nodeData.priority] || priorityColors.medium;
  const statusLabel = statusLabels[nodeData.status] || 'Planning';
  
  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[220px] max-w-[280px] transition-all duration-200
        ${selected ? 'border-[#6E8CFB]' : 'border-[#50589C]'}
        ${nodeData.isDimmed ? 'opacity-30' : 'opacity-100'}
        ${nodeGradient}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[#636CCB] !border-2 !border-[#50589C]"
      />
      
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
          Strategy
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${priority.bg} ${priority.text} font-medium`}>
          {priority.label}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full border border-white/30 text-white font-medium">
          {statusLabel}
        </span>
      </div>
      
      <div className="text-white font-bold text-base">
        {nodeData.title || 'Untitled Strategy'}
      </div>
      
      {nodeData.description && (
        <div className="text-white/80 text-sm mt-2 line-clamp-2">
          {nodeData.description}
        </div>
      )}
      
      {nodeData.objectives && (
        <div className="mt-2 p-2 bg-black/20 rounded-lg">
          <div className="text-white/60 text-xs font-semibold mb-1">Objectives</div>
          <div className="text-white/70 text-xs line-clamp-3">
            {nodeData.objectives}
          </div>
        </div>
      )}
      
      {nodeData.notes && (
        <div className="text-white/70 text-xs mt-2 line-clamp-2 italic">
          {nodeData.notes}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[#636CCB] !border-2 !border-[#50589C]"
      />
    </div>
  );
});

StrategyNode.displayName = 'StrategyNode';

export default StrategyNode;
