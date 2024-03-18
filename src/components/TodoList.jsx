import { ref, set, remove } from 'firebase/database';
import { useState } from 'react';
import { auth, database } from '../config/firebase';
import TodoItem from './TodoItem';
import { Card, List } from '@material-tailwind/react';

const TodoList = ({ filter, tasks, setTasks }) => {
  const [todo, setTodo] = useState(null);
  /** Filter Task */
  const taskList = tasks.filter((task) => {
    if (filter === 'complete') {
      return task.completed;
    } else if (filter === 'incomplete') {
      return !task.completed;
    } else {
      return task;
    }
  });

  const toggleCompleted = async (id) => {
    const task = tasks.find((el) => el.id === id);
    const newTask = { ...task, completed: !task.completed };
    const todoRef = ref(database, `todos/${auth.currentUser.uid}/${id}`);
    await set(todoRef, newTask)
      .then(() => setTasks(null))
      .catch((err) => {
        console.info(err);
        setTasks(null);
      });
  };

  const deleteTask = async (id) => {
    await remove(ref(database, `todos/${auth.currentUser.uid}/${id}`))
      .then(() => setTasks(null))
      .catch((err) => {
        console.info(err);
        setTasks(null);
      });
  };

  const updateTask = async (id, text) => {
    const task = tasks.find((el) => el.id === id);
    const newTask = { ...task, text: text };
    const todoRef = ref(database, `todos/${auth.currentUser.uid}/${id}`);
    await set(todoRef, newTask)
      .then(() => setTasks(null))
      .catch((err) => {
        console.info(err);
        setTasks(null);
      });
  };

  return (
    <Card>
      <List key="parent-list">
        {taskList.length ? (
          taskList.map((task) => {
            return (
              <TodoItem
                key={task.id}
                id={task.id}
                text={task.text}
                completed={task.completed}
                toggleCompleted={toggleCompleted}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            );
          })
        ) : (
          <h5 className="text-red-500 text-center my-2">No Item</h5>
        )}
      </List>
    </Card>
  );
};

export default TodoList;
