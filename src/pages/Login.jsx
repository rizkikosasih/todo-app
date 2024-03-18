import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../config/firebase';
import { getStorage, notifyMessage, unsetStorage } from '../constant';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  Alert
} from '@material-tailwind/react';

const Login = () => {
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

  const onLogin = async (evt) => {
    evt.preventDefault();
    setIsLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLoading(false);
        navigate('/home');
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
    if (getStorage('createUser')) {
      setNotify('createUser');
      unsetStorage('createUser');
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/home');
      }
    });
  }, []);

  return (
    <div className="max-container">
      <div className="centered-content">
        <form method="post" onSubmit={onLogin}>
          <Card className="w-80 tablet:w-96">
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-4 grid h-28 place-items-center">
              <Typography variant="h3" color="white">
                Sign In
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
                login
              </Button>

              <Typography variant="small" className="mt-6 flex justify-center">
                Don&apos;t have an account?
                <NavLink to="/register" className="ms-1 font-semibold text-blue-400">
                  Sign up
                </NavLink>
              </Typography>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Login;
