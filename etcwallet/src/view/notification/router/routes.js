import Index from './pages/Index';

import AccountSend from './pages/Send';
import Sign from './pages/Sign';
import AddAsset from './pages/AddAsset';
import AddChain from './pages/AddChain';
import SwitchChain from './pages/SwitchChain';
import Connect from './pages/Connect';

export default [
  {
    path: '/',
    component: Index,
  },
  {
    path: '/AccountSend',
    component: AccountSend,
  },
  {
    path: '/Sign',
    component: Sign,
  },
  {
    path: '/AddAsset',
    component: AddAsset,
  },
  {
    path: '/AddChain',
    component: AddChain,
  },
  {
    path: '/SwitchChain',
    component: SwitchChain,
  },
  {
    path: '/Connect',
    component: Connect,
  },
];
