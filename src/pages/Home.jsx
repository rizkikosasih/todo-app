import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { set, ref, remove, onValue } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { blueColor, filters } from '../constant';
import { uid } from 'uid';
import TodoItem from '../components/TodoItem';
import mySwal from '../constant/mySwal';
import { Button, Option, Select, Card, List, Input } from '@material-tailwind/react';

const Home = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [todo, setTodo] = useState('');

  const handleLogout = () => {
    mySwal
      .fire({
        title: '<h5>Are you sure want to logout?</h5>',
        showConfirmButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: blueColor,
        showCancelButton: true,
        cancelButtonText: 'No',
        cancelButtonColor: 'red'
      })
      .then((result) => {
        if (result.isConfirmed) {
          signOut(auth).then(() => navigate('/'));
        }
      });
  };

  const addTask = async (e) => {
    e.preventDefault();
    const id = uid();
    const newTask = {
      id: id,
      text: todo,
      completed: false,
      timestamp: new Date().getTime()
    };

    await set(ref(database, `todos/${auth.currentUser.uid}/${id}`), newTask)
      .then(() => {
        setFilter('all');
        setTodo('');
      })
      .catch((err) => console.info(err));
  };

  const toggleCompleted = async (id) => {
    const task = tasks.find((el) => el.id === id);
    const newTask = { ...task, completed: !task.completed };
    const todoRef = ref(database, `todos/${auth.currentUser.uid}/${id}`);
    await set(todoRef, newTask).catch((err) => console.info(err));
  };

  const deleteTask = async (id) => {
    const todoRef = ref(database, `todos/${auth.currentUser.uid}/${id}`);
    await remove(todoRef).catch((err) => console.info(err));
  };

  const updateTask = async (id, text) => {
    const task = tasks.find((el) => el.id === id);
    const newTask = { ...task, text: text };
    const todoRef = ref(database, `todos/${auth.currentUser.uid}/${id}`);
    await set(todoRef, newTask).catch((err) => console.info(err));
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/');
      } else {
        onValue(ref(database, `todos/${auth.currentUser.uid}`), (snapshot) => {
          setTasks([]);
          const data = snapshot.val();
          if (data) {
            const taskList = Object.values(data).filter((task) => {
              if (filter === 'complete') {
                return task.completed;
              } else if (filter === 'incomplete') {
                return !task.completed;
              } else {
                return task;
              }
            });

            taskList
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((task) => {
                setTasks((old) => [...old, task]);
              });
          }
        });
      }
    });
  }, [filter]);

  return (
    <div className="max-container">
      <h1 className="text-center font-caramel pt-20 mb-10">TODO LIST</h1>

      <div className="todo-content">
        <div className="todo-header">
          <div className="header">
            <div className="tablet:col-span-2 order-2 tablet:order-none">
              <Select
                color="blue"
                className="text-white"
                label="Filter Todo"
                value={filter}
                containerProps={{ className: 'min-w-[120px]' }}
                onChange={(filter) => setFilter(filter)}>
                {filters.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.text}
                    </Option>
                  );
                })}
              </Select>
            </div>

            <Button variant="gradient" color="red" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <form className="header" onSubmit={addTask}>
            <div className="tablet:col-span-2 order-2 tablet:order-none">
              <Input
                variant="outlined"
                label="Todo"
                placeholder="Todo"
                className="text-white"
                color="blue"
                autoFocus
                value={todo}
                containerProps={{ className: 'min-w-[120px]' }}
                onChange={(e) => setTodo(e.target.value)}
              />
            </div>

            <Button variant="gradient" color="green" type="submit">
              Add Todo
            </Button>
          </form>
        </div>

        <div className="todo-body">
          <Card>
            <List>
              {tasks.length ? (
                tasks.map((task) => {
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
        </div>
      </div>
    </div>
  );
};

export default Home;
