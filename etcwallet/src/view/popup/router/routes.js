import PageIndex from './pages/Index';
import AccountCreate from './pages/Account/Create';
import AccountImport from './pages/Account/Import';
import AccountTransaction from './pages/Account/Transaction';
import AccountSend from './pages/Account/Send';
import ImportToken from './pages/Token/Import';
import AddToken from './pages/Token/Add';
import SwitchChain from './pages/SwitchChain';
import AccountIndex from './pages/Account/index';
import Connect from './pages/Connect';

export default [
  {
    path: '/',
    component: PageIndex,
  },
  {
    path: '/AccountImport',
    component: AccountImport,
  },
  {
    path: '/AccountTransaction',
    component: AccountTransaction,
  },
  {
    path: '/AccountSend',
    component: AccountSend,
  },
  {
    path: '/ImportToken',
    component: ImportToken,
  },
  {
    path: '/AddToken',
    component: AddToken,
  },
  {
    path: '/AccountIndex',
    component: AccountIndex,
  }, {
    path: '/AccountCreate',
    component: AccountCreate
  },
];
