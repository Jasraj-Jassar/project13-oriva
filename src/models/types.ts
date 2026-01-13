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

export type NodeType = 'person' | 'task';
export type TaskStatus = 'todo' | 'doing' | 'done';

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

export interface SpaceNode {
  id: string;
  spaceId: string;
  type: NodeType;
  position: Position;
  data: PersonData | TaskData;
}

export interface SpaceEdge {
  id: string;
  spaceId: string;
  sourceId: string;
  targetId: string;
  label?: string;
  createdAt: string;
}

// Type guards
export function isPersonData(data: PersonData | TaskData): data is PersonData {
  return 'name' in data && !('title' in data);
}

export function isTaskData(data: PersonData | TaskData): data is TaskData {
  return 'title' in data && 'status' in data;
}
