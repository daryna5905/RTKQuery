import Basket from '@/views/Basket';
import AddNewProduct from '@/views/AddNewProduct';
import Main from '@/views/Main';
import { createBrowserRouter } from 'react-router';
import MainPage from '@/views/MainPage';
import CardForm from '@/components/CardForm/CardForm';

export const routes = [
  {
    Component: MainPage,
    children: [
      {
        path: '/',
        Component: Main,
        meta: {
          title: 'Головна',
          showInMenu: true,
        },
      },
      {
        path: '/addProduct',
        Component: AddNewProduct,
        meta: { title: 'Додати товар', showInMenu: true },
      },
      {
        path: '/product/:id',
        Component: CardForm,
      },
      {
        path: '/basket',
        Component: Basket,
        meta: {
          title: 'Кошик',
          showInMenu: true,
        },
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: '/RTKQuery',
});
export default router;
