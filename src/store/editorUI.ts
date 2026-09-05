import { create } from 'zustand';

interface EditorUIState {
  editingPhotoId: string | null;
  addingNew: boolean;
  setEditingPhotoId: (id: string | null) => void;
  setAddingNew: (v: boolean) => void;
}

// 全局编辑器 UI 状态，脱离 React 组件 state
export const useEditorUI = create<EditorUIState>((set) => ({
  editingPhotoId: null,
  addingNew: false,
  setEditingPhotoId: (id) => set({ editingPhotoId: id }),
  setAddingNew: (v) => set({ addingNew: v }),
}));
