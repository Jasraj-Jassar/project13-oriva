import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';

interface UseKeyboardShortcutsOptions {
  spaceId: string;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({ spaceId, enabled = true }: UseKeyboardShortcutsOptions) => {
  const { deleteSelected, undo, navigateNodes, pushHistory } = useStore();
  
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      // Delete or Backspace - delete selected node/edge
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        deleteSelected();
        return;
      }
      
      // Cmd/Ctrl + Z - undo
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }
      
      // Arrow keys - navigate between nodes
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          navigateNodes('up', spaceId);
          break;
        case 'ArrowDown':
          event.preventDefault();
          navigateNodes('down', spaceId);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          navigateNodes('left', spaceId);
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateNodes('right', spaceId);
          break;
      }
    },
    [enabled, spaceId, deleteSelected, undo, navigateNodes]
  );
  
  useEffect(() => {
    if (!enabled) return;
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
  
  // Return pushHistory so components can save state before making changes
  return { pushHistory };
};

export default useKeyboardShortcuts;
