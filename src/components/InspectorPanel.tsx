import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import type { SpaceNode, PersonData, TaskData, TaskStatus } from '../models';

const InspectorPanel = () => {
  const { selectedNodeId, nodes, updateNodeData, deleteNode, selectNode } = useStore();
  const [localData, setLocalData] = useState<PersonData | TaskData | null>(null);
  
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
  const personData = localData as PersonData;
  const taskData = localData as TaskData;
  
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
  
  return (
    <div className="w-80 bg-gray-900/95 border-l border-gray-700 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">
          {isPerson ? '👤 Person' : '📋 Task'}
        </h2>
        <button
          onClick={() => selectNode(null)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4 flex-1">
        {isPerson ? (
          <>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Name *</label>
              <input
                type="text"
                value={personData.name}
                onChange={(e) => setLocalData({ ...personData, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter name..."
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Role / Title</label>
              <input
                type="text"
                value={personData.role || ''}
                onChange={(e) => setLocalData({ ...personData, role: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g., Developer, Manager..."
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Notes</label>
              <textarea
                value={personData.notes || ''}
                onChange={(e) => setLocalData({ ...personData, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
                rows={4}
                placeholder="Additional notes..."
              />
            </div>
          </>
        ) : (
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
      </div>
      
      <div className="mt-4 space-y-2">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
