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

const priorityColors: Record<StrategyPriority, { bg: string; text: string; label: string }> = {
  critical: { bg: 'bg-red-500/60', text: 'text-red-100', label: '🔥 Critical' },
  high: { bg: 'bg-orange-500/50', text: 'text-orange-200', label: 'High' },
  medium: { bg: 'bg-yellow-500/50', text: 'text-yellow-200', label: 'Medium' },
  low: { bg: 'bg-blue-500/50', text: 'text-blue-200', label: 'Low' },
};

const statusIcons: Record<StrategyStatus, string> = {
  planning: '📋',
  active: '⚡',
  paused: '⏸️',
  completed: '✅',
};

const StrategyNode = memo(({ data, selected }: StrategyNodeProps) => {
  const nodeData = data;
  const priority = priorityColors[nodeData.priority] || priorityColors.medium;
  const statusIcon = statusIcons[nodeData.status] || '📋';
  
  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[220px] max-w-[280px] transition-all duration-200
        ${selected ? 'border-yellow-400 ring-2 ring-yellow-400/50' : 'border-amber-500/50'}
        ${nodeData.isDimmed ? 'opacity-30' : 'opacity-100'}
        ${nodeData.isHighlighted ? 'shadow-lg shadow-amber-500/30' : ''}
        bg-gradient-to-br from-amber-900/90 via-orange-900/90 to-amber-800/90
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-amber-600"
      />
      
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/50 text-amber-200 font-bold">
          ⚔️ Strategy
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${priority.bg} ${priority.text} font-medium`}>
          {priority.label}
        </span>
      </div>
      
      <div className="text-white font-bold text-base flex items-center gap-2">
        <span>{statusIcon}</span>
        <span>{nodeData.title || 'Untitled Strategy'}</span>
      </div>
      
      {nodeData.description && (
        <div className="text-amber-200/80 text-sm mt-2 line-clamp-2">
          {nodeData.description}
        </div>
      )}
      
      {nodeData.objectives && (
        <div className="mt-2 p-2 bg-black/20 rounded-lg">
          <div className="text-amber-300 text-xs font-semibold mb-1">🎯 Objectives</div>
          <div className="text-amber-100/70 text-xs line-clamp-3">
            {nodeData.objectives}
          </div>
        </div>
      )}
      
      {nodeData.notes && (
        <div className="text-amber-400/60 text-xs mt-2 line-clamp-2 italic">
          {nodeData.notes}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-amber-600"
      />
    </div>
  );
});

StrategyNode.displayName = 'StrategyNode';

export default StrategyNode;
