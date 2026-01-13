import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { TaskData, TaskStatus } from '../../models';

interface TaskNodeData extends TaskData {
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

interface TaskNodeProps {
  data: TaskNodeData;
  selected?: boolean;
}

const statusColors: Record<TaskStatus, { bg: string; text: string; label: string }> = {
  todo: { bg: 'bg-gray-500/50', text: 'text-gray-200', label: 'To Do' },
  doing: { bg: 'bg-yellow-500/50', text: 'text-yellow-200', label: 'Doing' },
  done: { bg: 'bg-green-500/50', text: 'text-green-200', label: 'Done' },
};

const TaskNode = memo(({ data, selected }: TaskNodeProps) => {
  const nodeData = data;
  const status = statusColors[nodeData.status] || statusColors.todo;
  
  return (
    <div
      className={`
        px-4 py-3 rounded-xl border-2 min-w-[180px] transition-all duration-200
        ${selected ? 'border-blue-400 ring-2 ring-blue-400/50' : 'border-teal-500/50'}
        ${nodeData.isDimmed ? 'opacity-30' : 'opacity-100'}
        ${nodeData.isHighlighted ? 'shadow-lg shadow-teal-500/30' : ''}
        bg-gradient-to-br from-teal-900/90 to-teal-800/90
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-teal-400 !border-2 !border-teal-600"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/50 text-teal-200 font-medium">
          Task
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text} font-medium`}>
          {status.label}
        </span>
      </div>
      
      <div className="text-white font-semibold text-sm">
        {nodeData.title || 'Untitled Task'}
      </div>
      
      {nodeData.notes && (
        <div className="text-teal-400/70 text-xs mt-2 line-clamp-2">
          {nodeData.notes}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-teal-400 !border-2 !border-teal-600"
      />
    </div>
  );
});

TaskNode.displayName = 'TaskNode';

export default TaskNode;
