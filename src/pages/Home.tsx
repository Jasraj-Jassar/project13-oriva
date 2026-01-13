import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Home = () => {
  const navigate = useNavigate();
  const { projects, createProject, renameProject, deleteProject, selectProject } = useStore();
  const [newProjectName, setNewProjectName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  const projectList = Object.values(projects).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  const handleCreate = () => {
    if (newProjectName.trim()) {
      const id = createProject(newProjectName.trim());
      setNewProjectName('');
      selectProject(id);
      navigate(`/project/${id}`);
    }
  };
  
  const handleOpen = (id: string) => {
    selectProject(id);
    navigate(`/project/${id}`);
  };
  
  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };
  
  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      renameProject(editingId, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };
  
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete project "${name}"? This cannot be undone.`)) {
      deleteProject(id);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
            🗂️ Oriva
          </h1>
          <p className="text-gray-400 mt-1">
            Manage projects with People and Task cards in a node graph
          </p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Create new project */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Create New Project</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Enter project name..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              onClick={handleCreate}
              disabled={!newProjectName.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              + Create
            </button>
          </div>
        </div>
        
        {/* Project list */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Your Projects</h2>
          
          {projectList.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-800">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-gray-400">No projects yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projectList.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingId === project.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                            className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white focus:outline-none focus:border-purple-500"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-400 hover:text-green-300 px-2"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-400 hover:text-gray-300 px-2"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-medium text-white">{project.name}</h3>
                          <p className="text-sm text-gray-500">
                            Created {new Date(project.createdAt).toLocaleDateString()} •{' '}
                            Updated {new Date(project.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {editingId !== project.id && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleOpen(project.id)}
                          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => handleStartEdit(project.id, project.name)}
                          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                          title="Rename"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.name)}
                          className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
