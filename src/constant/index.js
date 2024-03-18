export const setStorage = (object) => {
  for (const [key, value] of Object.entries(object)) {
    localStorage.setItem(key, value);
  }
};

export const unsetStorage = (params) => {
  if (typeof params === 'string') {
    localStorage.removeItem(params);
  } else if (typeof params === 'object') {
    params.map((item) => {
      localStorage.removeItem(item);
    });
  }
};

export const getStorage = (key) => {
  return localStorage.getItem(key);
};

export const filters = [
  {
    id: 'all',
    text: 'All'
  },
  {
    id: 'complete',
    text: 'Complete'
  },
  {
    id: 'incomplete',
    text: 'Incomplete'
  }
];

export const blueColor = '#008DDA';

export const notifyMessage = {
  'auth/invalid-credential': {
    color: 'red',
    text: 'Email or Password wrong'
  },
  'auth/email-already-in-use': {
    color: 'red',
    text: 'Email Already Exists'
  },
  'auth/weak-password': {
    color: 'red',
    text: 'Password should be at least 6 characters'
  },
  createUser: {
    color: 'green',
    text: 'Account has been created'
  }
};
