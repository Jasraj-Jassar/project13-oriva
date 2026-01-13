import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import type { SpaceNode, PersonData, TaskData, StrategyData, TaskStatus, StrategyPriority, StrategyStatus } from '../models';

const InspectorPanel = () => {
  const { selectedNodeId, nodes, updateNodeData, deleteNode, selectNode } = useStore();
  const [localData, setLocalData] = useState<PersonData | TaskData | StrategyData | null>(null);
  
  const node: SpaceNode | undefined = selectedNodeId ? nodes[selectedNodeId] : undefined;
  
  useEffect(() => {
    if (node) {
      setLocalData({ ...node.data });
    } else {
      setLocalData(null);
    }
  }, [node]);
  
  if (!node || !localData) {
    return (
      <div className="w-80 bg-gray-900/95 border-l border-gray-700 p-4 flex flex-col">
        <h2 className="text-gray-400 text-lg font-semibold mb-4">Inspector</h2>
        <p className="text-gray-500 text-sm">Select a card to edit its properties</p>
      </div>
    );
  }
  
  const isPerson = node.type === 'person';
  const isTask = node.type === 'task';
  const isStrategy = node.type === 'strategy';
  
  const personData = localData as PersonData;
  const taskData = localData as TaskData;
  const strategyData = localData as StrategyData;
  
  const handleSave = () => {
    if (selectedNodeId) {
      updateNodeData(selectedNodeId, localData);
    }
  };
  
  const handleDelete = () => {
    if (selectedNodeId && confirm('Are you sure you want to delete this card?')) {
      deleteNode(selectedNodeId);
      selectNode(null);
    }
  };
  
  const getTitle = () => {
    if (isPerson) return '👤 Person';
    if (isTask) return '�� Task';
    return '⚔️ Strategy';
  };
  
  const getAccentColor = () => {
    if (isPerson) return 'purple';
    if (isTask) return 'teal';
    return 'amber';
  };
  
  const accent = getAccentColor();
  
  return (
    <div className="w-80 bg-gray-900/95 border-l border-gray-700 p-4 flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">
          {getTitle()}
        </h2>
        <button
          onClick={() => selectNode(null)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4 flex-1">
        {isPerson && (
          <>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Name *</label>
              <input
                type="text"
                value={personData.name}
                onChange={(e) => setLocalData({ ...personData, name: e.target.value })}
                className={`w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-${accent}-500`}
                placeholder="Enter name..."
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Role / Title</label>
              <input
                type="text"
                value={personData.role || ''}
                onChange={(e) => setLocalData({ ...personData, role: e.target.value })}
                className={`w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-${accent}-500`}
                placeholder="e.g., Developer, Manager..."
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Notes</label>
              <textarea
                value={personData.notes || ''}
                onChange={(e) => setLocalData({ ...personData, notes: e.target.value })}
                className={`w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-${accent}-500 resize-none`}
                rows={4}
                placeholder="Additional notes..."
              />
            </div>
          </>
        )}
        
        {isTask && (
          <>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Title *</label>
              <input
                type="text"
                value={taskData.title}
                onChange={(e) => setLocalData({ ...taskData, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                placeholder="Enter task title..."
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Status</label>
              <select
                value={taskData.status}
                onChange={(e) => setLocalData({ ...taskData, status: e.target.value as TaskStatus })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Notes</label>
              <textarea
                value={taskData.notes || ''}
                onChange={(e) => setLocalData({ ...taskData, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500 resize-none"
                rows={4}
                placeholder="Additional notes..."
              />
            </div>
          </>
        )}
        
        {isStrategy && (
          <>
            <div>
              <label className="block text-amber-400 text-sm mb-1 font-semibold">Strategy Title *</label>
              <input
                type="text"
                value={strategyData.title}
                onChange={(e) => setLocalData({ ...strategyData, title: e.target.value })}
                className="w-full bg-gray-800 border border-amber-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g., Market Expansion, Cost Reduction..."
              />
            </div>
            <div>
              <label className="block text-amber-400 text-sm mb-1 font-semibold">Description</label>
              <textarea
                value={strategyData.description || ''}
                onChange={(e) => setLocalData({ ...strategyData, description: e.target.value })}
                className="w-full bg-gray-800 border border-amber-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 resize-none"
                rows={3}
                placeholder="Describe the strategy..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-amber-400 text-sm mb-1 font-semibold">Priority</label>
                <select
                  value={strategyData.priority}
                  onChange={(e) => setLocalData({ ...strategyData, priority: e.target.value as StrategyPriority })}
                  className="w-full bg-gray-800 border border-amber-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="critical">🔥 Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-amber-400 text-sm mb-1 font-semibold">Status</label>
                <select
                  value={strategyData.status}
                  onChange={(e) => setLocalData({ ...strategyData, status: e.target.value as StrategyStatus })}
                  className="w-full bg-gray-800 border border-amber-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="planning">📋 Planning</option>
                  <option value="active">⚡ Active</option>
                  <option value="paused">⏸️ Paused</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-amber-400 text-sm mb-1 font-semibold">🎯 Objectives</label>
              <textarea
                value={strategyData.objectives || ''}
                onChange={(e) => setLocalData({ ...strategyData, objectives: e.target.value })}
                className="w-full bg-gray-800 border border-amber-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 resize-none"
                rows={3}
                placeholder="What are the key objectives?"
              />
            </div>
            <div>
              <label className="block text-amber-400 text-sm mb-1 font-semibold">Notes</label>
              <textarea
                value={strategyData.notes || ''}
                onChange={(e) => setLocalData({ ...strategyData, notes: e.target.value })}
                className="w-full bg-gray-800 border border-amber-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 resize-none"
                rows={3}
                placeholder="Additional strategic notes..."
              />
            </div>
          </>
        )}
      </div>
      
      <div className="mt-4 space-y-2 pt-4 border-t border-gray-700">
        <button
          onClick={handleSave}
          className={`w-full ${isStrategy ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-4 rounded-lg transition-colors`}
        >
          Save Changes
        </button>
        <button
          onClick={handleDelete}
          className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-400 font-medium py-2 px-4 rounded-lg transition-colors border border-red-600/30"
        >
          Delete Card
        </button>
      </div>
    </div>
  );
};

export default InspectorPanel;
