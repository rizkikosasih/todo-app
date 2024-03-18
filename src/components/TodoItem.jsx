import mySwal from '../constant/mySwal';
import { ListItem, ListItemSuffix, Checkbox, IconButton } from '@material-tailwind/react';
import { GoTrash, GoPencil } from 'react-icons/go';
import { blueColor } from '../constant';

const TodoItem = ({ id, text, completed, toggleCompleted, deleteTask, updateTask }) => {
  const handleCheckbox = () => {
    toggleCompleted(id);
  };

  const handleDeleteTask = () => {
    mySwal
      .fire({
        title: '<h5>Are you sure want to delete?</h5>',
        showConfirmButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: blueColor,
        showCancelButton: true,
        cancelButtonText: 'No',
        cancelButtonColor: 'red'
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteTask(id);
        }
      });
  };

  const handleUpdateTask = async () => {
    const { value } = await mySwal.fire({
      title: '<h5>Your Todo</h5>',
      showConfirmButton: true,
      confirmButtonText: 'Submit',
      confirmButtonColor: blueColor,
      input: 'textarea',
      inputPlaceholder: 'Your Todo...',
      inputValue: text
    });

    if (value) {
      updateTask(id, value);
    }
  };

  return (
    <ListItem className="py-1 todo-item" id={id} ripple={false}>
      <Checkbox color="green" defaultChecked={completed} onChange={handleCheckbox} />
      <span className={completed ? 'line-through font-light' : 'font-normal'}>
        {text}
      </span>

      <ListItemSuffix className="flex flex-row">
        <IconButton variant="text" color="red" onClick={handleDeleteTask}>
          <GoTrash />
        </IconButton>

        <IconButton variant="text" color="blue" onClick={handleUpdateTask}>
          <GoPencil />
        </IconButton>
      </ListItemSuffix>
    </ListItem>
  );
};

export default TodoItem;
