import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Project, Space, SpaceNode, SpaceEdge, PersonData, TaskData, StrategyData, NodeType } from '../models';

const STORE_VERSION = 1;

interface AppState {
  // Data
  projects: Record<string, Project>;
  spaces: Record<string, Space>;
  nodes: Record<string, SpaceNode>;
  edges: Record<string, SpaceEdge>;
  
  // UI State
  selectedProjectId: string | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  highlightedNodeIds: Set<string>;
  
  // History for undo
  history: Array<{
    nodes: Record<string, SpaceNode>;
    edges: Record<string, SpaceEdge>;
  }>;
  historyIndex: number;
  
  // Project actions
  createProject: (name: string) => string;
  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;
  
  // Space actions
  initDefaultSpace: (projectId: string) => string;
  getSpaceByProjectId: (projectId: string) => Space | undefined;
  
  // Node actions
  addNode: (spaceId: string, type: NodeType, position: { x: number; y: number }, data: PersonData | TaskData | StrategyData) => string;
  updateNode: (id: string, updates: Partial<Omit<SpaceNode, 'id' | 'spaceId' | 'type'>>) => void;
  updateNodeData: (id: string, data: Partial<PersonData> | Partial<TaskData> | Partial<StrategyData>) => void;
  deleteNode: (id: string) => void;
  moveNode: (id: string, position: { x: number; y: number }) => void;
  selectNode: (id: string | null) => void;
  
  // Edge actions
  addEdge: (spaceId: string, sourceId: string, targetId: string, label?: string, sourceHandle?: string, targetHandle?: string) => string;
  deleteEdge: (id: string) => void;
  selectEdge: (id: string | null) => void;
  
  // History actions
  pushHistory: () => void;
  undo: () => void;
  
  // Keyboard actions
  deleteSelected: () => void;
  navigateNodes: (direction: 'up' | 'down' | 'left' | 'right', spaceId: string) => void;
  
  // Highlight actions
  setHighlightedNodes: (nodeIds: string[]) => void;
  clearHighlight: () => void;
  
  // Utility
  getNodesForSpace: (spaceId: string) => SpaceNode[];
  getEdgesForSpace: (spaceId: string) => SpaceEdge[];
  getConnectedNodeIds: (nodeId: string) => string[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: {},
      spaces: {},
      nodes: {},
      edges: {},
      selectedProjectId: null,
      selectedNodeId: null,
      selectedEdgeId: null,
      highlightedNodeIds: new Set(),
      history: [],
      historyIndex: -1,
      
      // Project actions
      createProject: (name: string) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        const project: Project = {
          id,
          name,
          createdAt: now,
          updatedAt: now,
          spaceIds: [],
        };
        
        set((state) => ({
          projects: { ...state.projects, [id]: project },
        }));
        
        // Create default space for project
        get().initDefaultSpace(id);
        
        return id;
      },
      
      renameProject: (id: string, name: string) => {
        set((state) => {
          const project = state.projects[id];
          if (!project) return state;
          
          return {
            projects: {
              ...state.projects,
              [id]: { ...project, name, updatedAt: new Date().toISOString() },
            },
          };
        });
      },
      
      deleteProject: (id: string) => {
        set((state) => {
          const project = state.projects[id];
          if (!project) return state;
          
          const newProjects = { ...state.projects };
          delete newProjects[id];
          
          // Delete associated spaces, nodes, and edges
          const newSpaces = { ...state.spaces };
          const newNodes = { ...state.nodes };
          const newEdges = { ...state.edges };
          
          project.spaceIds.forEach((spaceId) => {
            const space = newSpaces[spaceId];
            if (space) {
              space.nodeIds.forEach((nodeId) => delete newNodes[nodeId]);
              space.edgeIds.forEach((edgeId) => delete newEdges[edgeId]);
              delete newSpaces[spaceId];
            }
          });
          
          return {
            projects: newProjects,
            spaces: newSpaces,
            nodes: newNodes,
            edges: newEdges,
            selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
          };
        });
      },
      
      selectProject: (id: string | null) => {
        set({ selectedProjectId: id, selectedNodeId: null, highlightedNodeIds: new Set() });
      },
      
      // Space actions
      initDefaultSpace: (projectId: string) => {
        const id = uuidv4();
        const space: Space = {
          id,
          projectId,
          name: 'Main Space',
          nodeIds: [],
          edgeIds: [],
        };
        
        set((state) => {
          const project = state.projects[projectId];
          if (!project) return state;
          
          return {
            spaces: { ...state.spaces, [id]: space },
            projects: {
              ...state.projects,
              [projectId]: { ...project, spaceIds: [...project.spaceIds, id] },
            },
          };
        });
        
        return id;
      },
      
      getSpaceByProjectId: (projectId: string) => {
        const state = get();
        const project = state.projects[projectId];
        if (!project || project.spaceIds.length === 0) return undefined;
        return state.spaces[project.spaceIds[0]];
      },
      
      // Node actions
      addNode: (spaceId: string, type: NodeType, position: { x: number; y: number }, data: PersonData | TaskData | StrategyData) => {
        const id = uuidv4();
        const node: SpaceNode = {
          id,
          spaceId,
          type,
          position,
          data,
        };
        
        set((state) => {
          const space = state.spaces[spaceId];
          if (!space) return state;
          
          return {
            nodes: { ...state.nodes, [id]: node },
            spaces: {
              ...state.spaces,
              [spaceId]: { ...space, nodeIds: [...space.nodeIds, id] },
            },
          };
        });
        
        return id;
      },
      
      updateNode: (id: string, updates: Partial<Omit<SpaceNode, 'id' | 'spaceId' | 'type'>>) => {
        set((state) => {
          const node = state.nodes[id];
          if (!node) return state;
          
          return {
            nodes: {
              ...state.nodes,
              [id]: { ...node, ...updates },
            },
          };
        });
      },
      
      updateNodeData: (id: string, dataUpdates: Partial<PersonData> | Partial<TaskData> | Partial<StrategyData>) => {
        set((state) => {
          const node = state.nodes[id];
          if (!node) return state;
          
          return {
            nodes: {
              ...state.nodes,
              [id]: { ...node, data: { ...node.data, ...dataUpdates } as PersonData | TaskData | StrategyData },
            },
          };
        });
      },
      
      deleteNode: (id: string) => {
        set((state) => {
          const node = state.nodes[id];
          if (!node) return state;
          
          const newNodes = { ...state.nodes };
          delete newNodes[id];
          
          // Remove edges connected to this node
          const newEdges = { ...state.edges };
          const edgesToRemove: string[] = [];
          
          Object.values(state.edges).forEach((edge) => {
            if (edge.sourceId === id || edge.targetId === id) {
              edgesToRemove.push(edge.id);
              delete newEdges[edge.id];
            }
          });
          
          // Update space
          const space = state.spaces[node.spaceId];
          const newSpaces = space
            ? {
                ...state.spaces,
                [node.spaceId]: {
                  ...space,
                  nodeIds: space.nodeIds.filter((nid) => nid !== id),
                  edgeIds: space.edgeIds.filter((eid) => !edgesToRemove.includes(eid)),
                },
              }
            : state.spaces;
          
          return {
            nodes: newNodes,
            edges: newEdges,
            spaces: newSpaces,
            selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
          };
        });
      },
      
      moveNode: (id: string, position: { x: number; y: number }) => {
        set((state) => {
          const node = state.nodes[id];
          if (!node) return state;
          
          return {
            nodes: {
              ...state.nodes,
              [id]: { ...node, position },
            },
          };
        });
      },
      
      selectNode: (id: string | null) => {
        set({ selectedNodeId: id });
        
        // Update highlights when selecting a node
        if (id) {
          const connectedIds = get().getConnectedNodeIds(id);
          get().setHighlightedNodes([id, ...connectedIds]);
        } else {
          get().clearHighlight();
        }
      },
      
      // Edge actions
      addEdge: (spaceId: string, sourceId: string, targetId: string, label?: string, sourceHandle?: string, targetHandle?: string) => {
        // Check if edge already exists
        const existingEdge = Object.values(get().edges).find(
          (e) =>
            (e.sourceId === sourceId && e.targetId === targetId) ||
            (e.sourceId === targetId && e.targetId === sourceId)
        );
        
        if (existingEdge) return existingEdge.id;
        
        const id = uuidv4();
        const edge: SpaceEdge = {
          id,
          spaceId,
          sourceId,
          targetId,
          sourceHandle,
          targetHandle,
          label,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => {
          const space = state.spaces[spaceId];
          if (!space) return state;
          
          return {
            edges: { ...state.edges, [id]: edge },
            spaces: {
              ...state.spaces,
              [spaceId]: { ...space, edgeIds: [...space.edgeIds, id] },
            },
          };
        });
        
        return id;
      },
      
      deleteEdge: (id: string) => {
        set((state) => {
          const edge = state.edges[id];
          if (!edge) return state;
          
          const newEdges = { ...state.edges };
          delete newEdges[id];
          
          const space = state.spaces[edge.spaceId];
          const newSpaces = space
            ? {
                ...state.spaces,
                [edge.spaceId]: {
                  ...space,
                  edgeIds: space.edgeIds.filter((eid) => eid !== id),
                },
              }
            : state.spaces;
          
          return {
            edges: newEdges,
            spaces: newSpaces,
            selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
          };
        });
      },
      
      selectEdge: (id: string | null) => {
        // Only clear selectedNodeId when actually selecting an edge
        if (id !== null) {
          set({ selectedEdgeId: id, selectedNodeId: null });
        } else {
          set({ selectedEdgeId: null });
        }
        get().clearHighlight();
      },
      
      // History actions
      pushHistory: () => {
        const state = get();
        const snapshot = {
          nodes: { ...state.nodes },
          edges: { ...state.edges },
        };
        
        // Keep only last 50 history items
        const newHistory = [...state.history.slice(0, state.historyIndex + 1), snapshot].slice(-50);
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },
      
      undo: () => {
        const state = get();
        if (state.historyIndex <= 0) return;
        
        const previousIndex = state.historyIndex - 1;
        const previousState = state.history[previousIndex];
        
        if (previousState) {
          set({
            nodes: previousState.nodes,
            edges: previousState.edges,
            historyIndex: previousIndex,
          });
        }
      },
      
      // Keyboard actions
      deleteSelected: () => {
        const state = get();
        
        // Push current state to history before deletion
        get().pushHistory();
        
        if (state.selectedNodeId) {
          get().deleteNode(state.selectedNodeId);
        } else if (state.selectedEdgeId) {
          get().deleteEdge(state.selectedEdgeId);
        }
      },
      
      navigateNodes: (direction: 'up' | 'down' | 'left' | 'right', spaceId: string) => {
        const state = get();
        const spaceNodes = Object.values(state.nodes).filter((n) => n.spaceId === spaceId);
        
        if (spaceNodes.length === 0) return;
        
        // If no node selected, select the first one
        if (!state.selectedNodeId) {
          const firstNode = spaceNodes[0];
          if (firstNode) get().selectNode(firstNode.id);
          return;
        }
        
        const currentNode = state.nodes[state.selectedNodeId];
        if (!currentNode) return;
        
        // Find the closest node in the given direction
        let bestNode: SpaceNode | null = null;
        let bestDistance = Infinity;
        
        for (const node of spaceNodes) {
          if (node.id === currentNode.id) continue;
          
          const dx = node.position.x - currentNode.position.x;
          const dy = node.position.y - currentNode.position.y;
          
          let isInDirection = false;
          let distance = 0;
          
          switch (direction) {
            case 'up':
              isInDirection = dy < -20;
              distance = Math.abs(dy) + Math.abs(dx) * 0.5;
              break;
            case 'down':
              isInDirection = dy > 20;
              distance = Math.abs(dy) + Math.abs(dx) * 0.5;
              break;
            case 'left':
              isInDirection = dx < -20;
              distance = Math.abs(dx) + Math.abs(dy) * 0.5;
              break;
            case 'right':
              isInDirection = dx > 20;
              distance = Math.abs(dx) + Math.abs(dy) * 0.5;
              break;
          }
          
          if (isInDirection && distance < bestDistance) {
            bestDistance = distance;
            bestNode = node;
          }
        }
        
        if (bestNode) {
          get().selectNode((bestNode as SpaceNode).id);
        }
      },
      
      // Highlight actions
      setHighlightedNodes: (nodeIds: string[]) => {
        set({ highlightedNodeIds: new Set(nodeIds) });
      },
      
      clearHighlight: () => {
        set({ highlightedNodeIds: new Set() });
      },
      
      // Utility
      getNodesForSpace: (spaceId: string) => {
        const state = get();
        return Object.values(state.nodes).filter((n) => n.spaceId === spaceId);
      },
      
      getEdgesForSpace: (spaceId: string) => {
        const state = get();
        return Object.values(state.edges).filter((e) => e.spaceId === spaceId);
      },
      
      getConnectedNodeIds: (nodeId: string) => {
        const state = get();
        const connected: string[] = [];
        
        Object.values(state.edges).forEach((edge) => {
          if (edge.sourceId === nodeId) {
            connected.push(edge.targetId);
          } else if (edge.targetId === nodeId) {
            connected.push(edge.sourceId);
          }
        });
        
        return connected;
      },
    }),
    {
      name: 'oriva-store',
      version: STORE_VERSION,
      partialize: (state) => ({
        projects: state.projects,
        spaces: state.spaces,
        nodes: state.nodes,
        edges: state.edges,
        selectedProjectId: state.selectedProjectId,
      }),
      // Transform Set to Array for storage and back
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          return {
            ...parsed,
            state: {
              ...parsed.state,
              highlightedNodeIds: new Set(),
              selectedNodeId: null,
            },
          };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
