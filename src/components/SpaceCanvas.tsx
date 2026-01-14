import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Dagre from '@dagrejs/dagre';

import { useStore } from '../store/useStore';
import { useKeyboardShortcuts } from '../hooks';
import { PeopleNode, TaskNode, StrategyNode } from './nodes';
import type { Space } from '../models';

const nodeTypes: NodeTypes = {
  person: PeopleNode,
  task: TaskNode,
  strategy: StrategyNode,
};

interface SpaceCanvasProps {
  space: Space;
}

const SpaceCanvas = ({ space }: SpaceCanvasProps) => {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    selectedNodeId,
    selectedEdgeId,
    highlightedNodeIds,
    addEdge: addStoreEdge,
    moveNode,
    selectNode,
    selectEdge,
    pushHistory,
  } = useStore();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts({ spaceId: space.id });
  
  // Convert store nodes to React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    return Object.values(storeNodes)
      .filter((n) => n.spaceId === space.id)
      .map((n) => {
        const isNodeHighlighted = highlightedNodeIds.size === 0 || highlightedNodeIds.has(n.id);
        const isDimmed = highlightedNodeIds.size > 0 && !highlightedNodeIds.has(n.id);
        
        return {
          id: n.id,
          type: n.type,
          position: n.position,
          data: {
            ...n.data,
            isHighlighted: isNodeHighlighted,
            isDimmed,
          },
          selected: n.id === selectedNodeId,
        };
      });
  }, [storeNodes, space.id, selectedNodeId, highlightedNodeIds]);
  
  // Convert store edges to React Flow edges
  const initialEdges: Edge[] = useMemo(() => {
    return Object.values(storeEdges)
      .filter((e) => e.spaceId === space.id)
      .map((e) => {
        const isHighlighted =
          highlightedNodeIds.size === 0 ||
          (highlightedNodeIds.has(e.sourceId) && highlightedNodeIds.has(e.targetId));
        const isSelected = e.id === selectedEdgeId;
        
        return {
          id: e.id,
          source: e.sourceId,
          target: e.targetId,
          sourceHandle: e.sourceHandle,
          targetHandle: e.targetHandle,
          label: e.label,
          selected: isSelected,
          animated: isHighlighted || isSelected,
          style: {
            stroke: isSelected ? '#f59e0b' : isHighlighted ? '#60a5fa' : '#374151',
            strokeWidth: isSelected ? 3 : isHighlighted ? 2 : 1,
            opacity: isHighlighted || isSelected ? 1 : 0.3,
          },
        };
      });
  }, [storeEdges, space.id, highlightedNodeIds, selectedEdgeId]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Sync with store when store changes
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      
      // Handle position changes
      changes.forEach((change) => {
        if (change.type === 'position' && change.position && change.dragging === false) {
          moveNode(change.id, change.position);
        }
      });
    },
    [onNodesChange, moveNode]
  );
  
  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );
  
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        pushHistory();
        addStoreEdge(
          space.id,
          connection.source,
          connection.target,
          undefined,
          connection.sourceHandle ?? undefined,
          connection.targetHandle ?? undefined
        );
        setEdges((eds) => addEdge(connection, eds));
      }
    },
    [addStoreEdge, space.id, setEdges, pushHistory]
  );
  
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.id);
      selectEdge(null);
    },
    [selectNode, selectEdge]
  );
  
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      selectEdge(edge.id);
      selectNode(null);
    },
    [selectEdge, selectNode]
  );
  
  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);
  
  // Auto-layout using Dagre
  const handleAutoLayout = useCallback(() => {
    const dagreGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 100 });
    
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 200, height: 100 });
    });
    
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
    
    Dagre.layout(dagreGraph);
    
    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 100,
          y: nodeWithPosition.y - 50,
        },
      };
    });
    
    setNodes(newNodes);
    
    // Persist new positions
    newNodes.forEach((node) => {
      moveNode(node.id, node.position);
    });
  }, [nodes, edges, setNodes, moveNode]);
  
  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        className="bg-[#111F35]"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#60a5fa', strokeWidth: 2 },
        }}
      >
        <Controls className="!bg-gray-800 !border-gray-600 !rounded-lg" />
        <Panel position="top-right">
          <button
            onClick={handleAutoLayout}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 flex items-center gap-2 transition-colors"
          >
            <span>⟳</span>
            <span>Re-layout</span>
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default SpaceCanvas;
