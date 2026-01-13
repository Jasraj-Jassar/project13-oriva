import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';

import { useStore } from '../store/useStore';
import SpaceCanvas from '../components/SpaceCanvas';
import InspectorPanel from '../components/InspectorPanel';
import type { PersonData, TaskData } from '../models';

const Project = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const {
    projects,
    selectProject,
    getSpaceByProjectId,
    addNode,
    selectedNodeId,
  } = useStore();
  
  const project = projectId ? projects[projectId] : undefined;
  const space = projectId ? getSpaceByProjectId(projectId) : undefined;
  
  useEffect(() => {
    if (projectId) {
      selectProject(projectId);
    }
    
    return () => {
      selectProject(null);
    };
  }, [projectId, selectProject]);
  
  if (!project || !space) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }
  
  const handleAddPerson = () => {
    const data: PersonData = {
      name: 'New Person',
      role: '',
      notes: '',
    };
    
    // Add at a random position near center
    const position = {
      x: 200 + Math.random() * 300,
      y: 100 + Math.random() * 200,
    };
    
    addNode(space.id, 'person', position, data);
  };
  
  const handleAddTask = () => {
    const data: TaskData = {
      title: 'New Task',
      status: 'todo',
      notes: '',
    };
    
    // Add at a random position near center
    const position = {
      x: 200 + Math.random() * 300,
      y: 100 + Math.random() * 200,
    };
    
    addNode(space.id, 'task', position, data);
  };
  
  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-gray-800 bg-gray-900/80 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors"
            title="Back to Home"
          >
            ← Home
          </Link>
          <div className="h-6 w-px bg-gray-700" />
          <h1 className="text-xl font-semibold">{project.name}</h1>
          <span className="text-gray-500 text-sm">• {space.name}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddPerson}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <span>👤</span>
            <span>Add Person</span>
          </button>
          <button
            onClick={handleAddTask}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <span>📋</span>
            <span>Add Task</span>
          </button>
        </div>
      </header>
      
      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        <ReactFlowProvider>
          <SpaceCanvas space={space} />
        </ReactFlowProvider>
        
        {/* Inspector panel - only show when node is selected */}
        {selectedNodeId && <InspectorPanel />}
      </div>
      
      {/* Help tooltip */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 text-gray-300 text-sm px-4 py-2 rounded-lg border border-gray-700">
        💡 Drag from handles to connect cards • Click a card to edit • Scroll to zoom
      </div>
    </div>
  );
};

export default Project;
