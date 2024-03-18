import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const mySwal = withReactContent(Swal);

export const swalToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    /* Handling When Toast Open
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer; */
  }
});

export default mySwal;
