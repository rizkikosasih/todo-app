import { Button } from '@material-tailwind/react';
import z404z from './../assets/svg/z404z.svg';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="centered-content">
      <img src={z404z} loading="lazy" className="not-found" />
      <p className="font-semibold text-red-500 my-3 mx-auto">Page Not Found</p>
      <Link to="/" className="mx-auto">
        <Button variant="gradient" color="blue" size="lg">
          Home
        </Button>
      </Link>
    </div>
  );
};

export default PageNotFound;
