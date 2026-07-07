import { create } from 'zustand';
import { ref, onValue, set, update, remove, off } from 'firebase/database';
import { database } from '../lib/firebase';
import { Todo, UserStats, PriorityLevel, SubTask } from '../types';

interface TodoState {
  todos: Todo[];
  stats: UserStats;
  filter: 'all' | 'complete' | 'incomplete';
  triggerConfetti: boolean;
  setFilter: (filter: 'all' | 'complete' | 'incomplete') => void;
  resetConfetti: () => void;
  fetchTodos: (userId: string) => () => void;
  fetchStats: (userId: string) => () => void;
  addTodo: (
    userId: string,
    text: string,
    priority: PriorityLevel,
    category: string,
    dueDate: string
  ) => Promise<void>;
  toggleTodo: (userId: string, todoId: string) => Promise<void>;
  deleteTodo: (userId: string, todoId: string) => Promise<void>;
  updateTodo: (
    userId: string,
    todoId: string,
    text: string,
    priority: PriorityLevel,
    category: string,
    dueDate: string
  ) => Promise<void>;
  addSubtask: (userId: string, todoId: string, text: string) => Promise<void>;
  toggleSubtask: (userId: string, todoId: string, subtaskId: string) => Promise<void>;
  deleteSubtask: (userId: string, todoId: string, subtaskId: string) => Promise<void>;
}

const getLocalDateString = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

const initialStats: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  lastCompletedDate: null
};

export const useTodoStore = create<TodoState>((setLocalStore, getStore) => ({
  todos: [],
  stats: initialStats,
  filter: 'all',
  triggerConfetti: false,
  setFilter: (filter) => setLocalStore({ filter }),
  resetConfetti: () => setLocalStore({ triggerConfetti: false }),

  fetchTodos: (userId) => {
    const todosRef = ref(database, `todos/${userId}`);
    const unsubscribe = onValue(todosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const todoList: Todo[] = Object.values(data).map((item: any) => {
          // Parsing defensif untuk data V1 agar tidak error
          return {
            id: item.id,
            text: item.text,
            completed: !!item.completed,
            timestamp: item.timestamp || Date.now(),
            priority: item.priority || 'medium',
            category: item.category || 'General',
            dueDate: item.dueDate || '',
            subtasks: item.subtasks || {}
          };
        });
        // Sort descending by timestamp
        todoList.sort((a, b) => b.timestamp - a.timestamp);
        setLocalStore({ todos: todoList });
      } else {
        setLocalStore({ todos: [] });
      }
    });

    return () => off(todosRef, 'value', unsubscribe);
  },

  fetchStats: (userId) => {
    const statsRef = ref(database, `stats/${userId}`);
    const unsubscribe = onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const stats: UserStats = {
          xp: typeof data.xp === 'number' ? data.xp : 0,
          level: typeof data.level === 'number' ? data.level : 1,
          streak: typeof data.streak === 'number' ? data.streak : 0,
          lastCompletedDate: data.lastCompletedDate || null
        };

        // Cek apakah streak harian hangus
        const today = getLocalDateString();
        const yesterday = getYesterdayDateString();
        if (
          stats.lastCompletedDate &&
          stats.lastCompletedDate !== today &&
          stats.lastCompletedDate !== yesterday &&
          stats.streak > 0
        ) {
          // Reset streak di database ke 0
          update(statsRef, { streak: 0 });
        } else {
          setLocalStore({ stats });
        }
      } else {
        // Inisialisasi data stats di DB jika belum ada
        set(statsRef, initialStats);
        setLocalStore({ stats: initialStats });
      }
    });

    return () => off(statsRef, 'value', unsubscribe);
  },

  addTodo: async (userId, text, priority, category, dueDate) => {
    const todoId = crypto.randomUUID();
    const newTodo: Todo = {
      id: todoId,
      text,
      completed: false,
      timestamp: Date.now(),
      priority,
      category: category || 'General',
      dueDate: dueDate || '',
      subtasks: {}
    };
    await set(ref(database, `todos/${userId}/${todoId}`), newTodo);
  },

  toggleTodo: async (userId, todoId) => {
    const todo = getStore().todos.find((t) => t.id === todoId);
    if (!todo) return;

    const newCompleted = !todo.completed;
    const todoRef = ref(database, `todos/${userId}/${todoId}`);

    // Update todo completion
    await update(todoRef, { completed: newCompleted });

    // Hitung Gamifikasi (XP & Streak)
    const currentStats = getStore().stats;
    const xpChange = newCompleted ? 10 : -10;

    // Perhitungan XP dan Level
    let newXp = currentStats.xp + xpChange;
    let newLevel = currentStats.level;
    let didLevelUp = false;

    if (newXp >= 100) {
      newXp -= 100;
      newLevel += 1;
      didLevelUp = true;
    } else if (newXp < 0) {
      if (newLevel > 1) {
        newXp += 100;
        newLevel -= 1;
      } else {
        newXp = 0;
      }
    }

    // Perhitungan Daily Streaks
    let newStreak = currentStats.streak;
    let newLastCompletedDate = currentStats.lastCompletedDate;

    if (newCompleted) {
      const today = getLocalDateString();
      const yesterday = getYesterdayDateString();

      if (!newLastCompletedDate) {
        newStreak = 1;
        newLastCompletedDate = today;
      } else if (newLastCompletedDate === yesterday) {
        newStreak += 1;
        newLastCompletedDate = today;
      } else if (newLastCompletedDate !== today) {
        // Jika sudah lewat beberapa hari, streak tereset ke 1
        newStreak = 1;
        newLastCompletedDate = today;
      }
      // Jika newLastCompletedDate === today, streak tetap (tidak bertambah ganda dalam 1 hari)
    }

    // Simpan stats baru ke Firebase
    const statsRef = ref(database, `stats/${userId}`);
    await update(statsRef, {
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      lastCompletedDate: newLastCompletedDate
    });

    if (didLevelUp) {
      setLocalStore({ triggerConfetti: true });
    }
  },

  deleteTodo: async (userId, todoId) => {
    // Jika todo yang dihapus sudah diselesaikan, kurangi XP agar seimbang
    const todo = getStore().todos.find((t) => t.id === todoId);
    if (todo && todo.completed) {
      const currentStats = getStore().stats;
      let newXp = currentStats.xp - 10;
      let newLevel = currentStats.level;
      if (newXp < 0) {
        if (newLevel > 1) {
          newXp += 100;
          newLevel -= 1;
        } else {
          newXp = 0;
        }
      }
      const statsRef = ref(database, `stats/${userId}`);
      await update(statsRef, { xp: newXp, level: newLevel });
    }
    await remove(ref(database, `todos/${userId}/${todoId}`));
  },

  updateTodo: async (userId, todoId, text, priority, category, dueDate) => {
    const todoRef = ref(database, `todos/${userId}/${todoId}`);
    await update(todoRef, {
      text,
      priority,
      category,
      dueDate
    });
  },

  addSubtask: async (userId, todoId, text) => {
    const subtaskId = crypto.randomUUID();
    const newSubtask: SubTask = {
      id: subtaskId,
      text,
      completed: false
    };
    await set(
      ref(database, `todos/${userId}/${todoId}/subtasks/${subtaskId}`),
      newSubtask
    );
  },

  toggleSubtask: async (userId, todoId, subtaskId) => {
    const todo = getStore().todos.find((t) => t.id === todoId);
    if (!todo || !todo.subtasks || !todo.subtasks[subtaskId]) return;

    const subtask = todo.subtasks[subtaskId];
    const newCompleted = !subtask.completed;

    const subtaskRef = ref(database, `todos/${userId}/${todoId}/subtasks/${subtaskId}`);
    await update(subtaskRef, { completed: newCompleted });

    // Gamifikasi: Subtask memberi +2 XP
    const currentStats = getStore().stats;
    const xpChange = newCompleted ? 2 : -2;

    let newXp = currentStats.xp + xpChange;
    let newLevel = currentStats.level;
    let didLevelUp = false;

    if (newXp >= 100) {
      newXp -= 100;
      newLevel += 1;
      didLevelUp = true;
    } else if (newXp < 0) {
      if (newLevel > 1) {
        newXp += 100;
        newLevel -= 1;
      } else {
        newXp = 0;
      }
    }

    const statsRef = ref(database, `stats/${userId}`);
    await update(statsRef, { xp: newXp, level: newLevel });

    if (didLevelUp) {
      setLocalStore({ triggerConfetti: true });
    }
  },

  deleteSubtask: async (userId, todoId, subtaskId) => {
    const todo = getStore().todos.find((t) => t.id === todoId);
    if (!todo || !todo.subtasks || !todo.subtasks[subtaskId]) return;

    const subtask = todo.subtasks[subtaskId];
    // Kurangi XP jika subtask yang dihapus sudah diselesaikan
    if (subtask.completed) {
      const currentStats = getStore().stats;
      let newXp = currentStats.xp - 2;
      let newLevel = currentStats.level;
      if (newXp < 0) {
        if (newLevel > 1) {
          newXp += 100;
          newLevel -= 1;
        } else {
          newXp = 0;
        }
      }
      const statsRef = ref(database, `stats/${userId}`);
      await update(statsRef, { xp: newXp, level: newLevel });
    }

    await remove(ref(database, `todos/${userId}/${todoId}/subtasks/${subtaskId}`));
  }
}));
