import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export const userStore = persistentAtom('user', '');
export const isCartOpen = atom(false);

export const saveUserInfo = ({ data }) => {
  userStore.set(JSON.stringify(data));
};

export const userInfo = () => {
  if (userStore.get()) {
    return JSON.parse(userStore.get())
  } else {
    return false;
  }
};

export const deleteUserInfo = () => {
  userStore.set('');
  localStorage.clear();
};

export const isLoggedIn = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user.token ? true : false;
};
