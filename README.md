# 🗂️ Oriva


<img width="640" alt="image" src="https://github.com/user-attachments/assets/03920d4c-c05e-45d8-b6e2-8c587e8340df" />

A local-first web app for managing projects by linking **People** and **Task** cards inside a "Space" and visualizing relationships as an Obsidian-style node graph.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4)
![React Flow](https://img.shields.io/badge/React%20Flow-12-ff0072)

## ✨ Features

### Projects
- Create, rename, and delete projects
- Each project has a dedicated Space for organizing cards

### Space Canvas
- Dark, chalkboard-like canvas interface
- Add **People Cards** (name, role, notes)
- Add **Task Cards** (title, status, notes)
- Drag cards to reposition - positions persist
- Zoom and pan navigation
- Connect cards by dragging from handles

### Node Graph Visualization
- All cards displayed as styled nodes
- Connections shown as animated edges
- Click a node to highlight it and connected neighbors
- **Re-layout** button applies force-directed layout (Dagre)

### Inspector Panel
- Click any card to open the side panel editor
- Edit all fields inline
- Delete cards

### Persistence
- **100% Local-first** - all data stored in browser localStorage
- No backend, no authentication required
- Data survives page refresh
- Export data via browser console

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:Jasraj-Jassar/project13-oriva.git
cd project13-oriva

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

- **React 19** + **TypeScript** - UI framework
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **React Flow** - Canvas, nodes, edges, and graph visualization
- **Zustand** - State management with persistence
- **Dagre** - Force-directed graph layout
- **React Router** - Client-side routing

## 📁 Project Structure

```
src/
├── models/
│   ├── types.ts          # Data types (Project, Space, Node, Edge)
│   └── index.ts
├── store/
│   └── useStore.ts       # Zustand store with localStorage persistence
├── pages/
│   ├── Home.tsx          # Project list page
│   └── Project.tsx       # Space/canvas view
├── components/
│   ├── nodes/
│   │   ├── PeopleNode.tsx   # Person card component
│   │   ├── TaskNode.tsx     # Task card component
│   │   └── index.ts
│   ├── SpaceCanvas.tsx      # React Flow canvas setup
│   └── InspectorPanel.tsx   # Side panel editor
├── App.tsx               # Router configuration
├── main.tsx              # Entry point
└── index.css             # Tailwind + custom styles
```

## 📊 Data Model

```typescript
Project: { id, name, createdAt, updatedAt, spaceIds[] }
Space: { id, projectId, name, nodeIds[], edgeIds[] }
Node: { id, spaceId, type: 'person'|'task', position:{x,y}, data:{...} }
Edge: { id, spaceId, sourceId, targetId, label?, createdAt }
```

## 🎯 Usage

1. **Create a Project** - Enter a name and click "Create"
2. **Open the Space** - Click "Open" on any project
3. **Add Cards** - Use "Add Person" or "Add Task" buttons
4. **Connect Cards** - Drag from the bottom handle of one card to the top handle of another
5. **Edit Cards** - Click any card to open the inspector panel
6. **Rearrange** - Drag cards to reposition, or click "Re-layout" for auto-arrangement
7. **Navigate** - Scroll to zoom, drag canvas to pan

## 💾 Data Backup

Export your data from browser console:
```javascript
copy(localStorage.getItem('oriva-store'))
```

Clear all data:
```javascript
localStorage.removeItem('oriva-store')
```

## 📝 License

MIT

---

Built with ❤️ using React Flow and Zustand
