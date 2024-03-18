import { useState, useRef, useEffect } from 'react';
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { auth } from './../config/firebase';
import { notifyMessage, setStorage } from '../constant';
import {
  Alert,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button
} from '@material-tailwind/react';

const Register = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notify, setNotify] = useState(null);

  const PasswordIcon = () => {
    const handlePassword = () => setShowPassword(!showPassword);

    if (showPassword) {
      return <RiEyeLine className="cursor-pointer" onClick={handlePassword} />;
    } else {
      return <RiEyeCloseLine className="cursor-pointer" onClick={handlePassword} />;
    }
  };

  const onRegister = async (evt) => {
    evt.preventDefault();
    setIsLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLoading(false);
        setStorage({ createUser: true });
        signOut(auth);
      })
      .catch((err) => {
        setIsLoading(false);
        setEmail('');
        setPassword('');
        setNotify(err.code);
        emailRef.current.focus();
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/home');
      }
    });
  }, []);

  return (
    <div className="max-container">
      <div className="centered-content">
        <form method="post" onSubmit={onRegister}>
          <Card className="w-80 tablet:w-96">
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-4 grid h-28 place-items-center">
              <Typography variant="h3" color="white">
                Sign Up
              </Typography>
            </CardHeader>

            <CardBody className="flex flex-col gap-4">
              {notify && (
                <Alert
                  open={true}
                  onClose={() => setNotify(null)}
                  color={notifyMessage[notify].color}
                  variant="gradient"
                  className="font-semibold text-sm">
                  {notifyMessage[notify].text}
                </Alert>
              )}

              <Input
                label="Email"
                size="lg"
                color="blue"
                required
                type="email"
                inputRef={emailRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<MdOutlineAlternateEmail />}
              />

              <Input
                label="Password"
                size="lg"
                color="blue"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<PasswordIcon />}
              />
            </CardBody>

            <CardFooter className="pt-0">
              <Button
                variant="gradient"
                color="blue"
                type="submit"
                loading={isLoading}
                fullWidth>
                register
              </Button>
              <Typography variant="small" className="mt-6 flex justify-center">
                Already have an account?
                <NavLink to="/" className="ms-1 font-semibold text-blue-400">
                  Sign in
                </NavLink>
              </Typography>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Register;
