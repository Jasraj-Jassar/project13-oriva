// Data models for the Oriva project management app

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  spaceIds: string[];
}

export interface Space {
  id: string;
  projectId: string;
  name: string;
  nodeIds: string[];
  edgeIds: string[];
}

export interface Position {
  x: number;
  y: number;
}

export type NodeType = 'person' | 'task' | 'strategy';
export type TaskStatus = 'todo' | 'doing' | 'done';
export type StrategyPriority = 'critical' | 'high' | 'medium' | 'low';
export type StrategyStatus = 'planning' | 'active' | 'paused' | 'completed';

export interface PersonData {
  name: string;
  role?: string;
  notes?: string;
}

export interface TaskData {
  title: string;
  status: TaskStatus;
  notes?: string;
}

export interface StrategyData {
  title: string;
  description?: string;
  priority: StrategyPriority;
  status: StrategyStatus;
  objectives?: string;
  notes?: string;
}

export interface SpaceNode {
  id: string;
  spaceId: string;
  type: NodeType;
  position: Position;
  data: PersonData | TaskData | StrategyData;
}

export interface SpaceEdge {
  id: string;
  spaceId: string;
  sourceId: string;
  targetId: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  createdAt: string;
}

// Type guards
export function isPersonData(data: PersonData | TaskData | StrategyData): data is PersonData {
  return 'name' in data && !('title' in data);
}

export function isTaskData(data: PersonData | TaskData | StrategyData): data is TaskData {
  return 'title' in data && 'status' in data && !('priority' in data);
}

export function isStrategyData(data: PersonData | TaskData | StrategyData): data is StrategyData {
  return 'title' in data && 'priority' in data && 'status' in data;
}
