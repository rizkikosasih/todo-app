import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo, PriorityLevel, SubTask } from '../types';
import { useTodoStore } from '../store/useTodoStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  CheckSquare,
  Square,
  AlertCircle,
  Bookmark,
  Save,
  X
} from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const { user } = useAuthStore();
  const { toggleTodo, deleteTodo, updateTodo, addSubtask, toggleSubtask, deleteSubtask } =
    useTodoStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  // Edit Form States
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<PriorityLevel>(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate);

  if (!user) return null;

  const handleToggle = () => {
    toggleTodo(user.uid, todo.id);
  };

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      deleteTodo(user.uid, todo.id);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim()) return;
    await updateTodo(
      user.uid,
      todo.id,
      editText,
      editPriority,
      editCategory,
      editDueDate
    );
    setIsEditing(false);
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    await addSubtask(user.uid, todo.id, newSubtaskText.trim());
    setNewSubtaskText('');
    setIsExpanded(true);
  };

  const isOverdue =
    todo.dueDate &&
    !todo.completed &&
    new Date(todo.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  // Count subtask stats
  const subtaskArray = (todo.subtasks ? Object.values(todo.subtasks) : []) as SubTask[];
  const completedSubtasks = subtaskArray.filter((s: SubTask) => s.completed).length;
  const totalSubtasks = subtaskArray.length;

  const priorityColors: Record<PriorityLevel, string> = {
    high: 'bg-red-500/10 text-red-500 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className={`glass rounded-2xl p-4 border transition-all duration-300 ${
        todo.completed
          ? 'opacity-65 border-border/40'
          : 'border-border/80 hover:border-primary/30'
      } ${isOverdue ? 'border-red-500/30' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 bg-background/50 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Judul Todo..."
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-bold px-1">
                Prioritas
              </label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as PriorityLevel)}
                className="w-full bg-background/50 border rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-bold px-1">
                Kategori
              </label>
              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full bg-background/50 border rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Work, Personal..."
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-bold px-1">
                Tenggat Waktu
              </label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full bg-background/50 border rounded-xl px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs hover:bg-muted">
              <X size={14} /> Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs hover:opacity-90 font-semibold">
              <Save size={14} /> Simpan
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <button
                onClick={handleToggle}
                className={`p-0.5 rounded-md hover:bg-primary/10 transition-colors text-primary shrink-0 mt-0.5`}>
                {todo.completed ? (
                  <CheckSquare className="w-5 h-5 fill-primary/25" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <span
                  className={`text-sm font-medium break-words transition-all duration-300 block ${
                    todo.completed
                      ? 'line-through text-muted-foreground font-light'
                      : 'text-foreground'
                  }`}>
                  {todo.text}
                </span>

                {/* Tags and Metadatas */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {/* Priority Badge */}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ${priorityColors[todo.priority]}`}>
                    {todo.priority}
                  </span>

                  {/* Category Tag */}
                  {todo.category && (
                    <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/15 flex items-center gap-1 shrink-0">
                      <Bookmark size={10} />
                      {todo.category}
                    </span>
                  )}

                  {/* Due Date Tag */}
                  {todo.dueDate && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 shrink-0 ${
                        todo.completed
                          ? 'bg-muted text-muted-foreground border-border/50'
                          : isOverdue
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : 'bg-muted text-muted-foreground border-border/80'
                      }`}>
                      {isOverdue && !todo.completed ? (
                        <AlertCircle size={10} className="text-red-500" />
                      ) : (
                        <Calendar size={10} />
                      )}
                      {todo.dueDate}
                      {isOverdue && !todo.completed && ' (Terlambat)'}
                    </span>
                  )}

                  {/* Subtask Progress indicator */}
                  {totalSubtasks > 0 && (
                    <span className="text-[10px] font-semibold bg-secondary text-muted-foreground px-2 py-0.5 rounded-md border border-border flex items-center gap-1 shrink-0">
                      {completedSubtasks}/{totalSubtasks} Subtasks
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions group */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  setEditText(todo.text);
                  setEditPriority(todo.priority);
                  setEditCategory(todo.category);
                  setEditDueDate(todo.dueDate);
                  setIsEditing(true);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                title="Edit Tugas">
                <Edit3 size={15} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors"
                title="Hapus Tugas">
                <Trash2 size={15} />
              </button>
              {totalSubtasks > 0 || !todo.completed ? (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  title="Tampilkan Subtask">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              ) : null}
            </div>
          </div>

          {/* Subtask expanded section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="pl-8 pr-2 pt-2 border-t border-border/30 space-y-2 overflow-hidden">
                {/* Subtask List */}
                <div className="space-y-1.5">
                  {subtaskArray.map((subtask: SubTask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center justify-between gap-2 group/sub">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          onClick={() => toggleSubtask(user.uid, todo.id, subtask.id)}
                          className="text-primary hover:bg-primary/10 rounded shrink-0">
                          {subtask.completed ? (
                            <CheckSquare className="w-4 h-4 fill-primary/20" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        <span
                          className={`text-xs break-words ${
                            subtask.completed
                              ? 'line-through text-muted-foreground font-light'
                              : 'text-foreground'
                          }`}>
                          {subtask.text}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteSubtask(user.uid, todo.id, subtask.id)}
                        className="p-1 rounded opacity-0 group-hover/sub:opacity-100 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                        title="Hapus Subtask">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subtask Add Form */}
                {!todo.completed && (
                  <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newSubtaskText}
                      onChange={(e) => setNewSubtaskText(e.target.value)}
                      placeholder="Tambah subtask baru..."
                      className="flex-1 bg-background/30 border border-border/80 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 transition-colors shrink-0">
                      <Plus size={14} />
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
