import React from 'react';
import ReactDOM from 'react-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import FormDTP from './COMPONENTS/FormDTP';
import App from './App';
import Form1 from './COMPONENTS/FormBook';
import FormPrinting from './COMPONENTS/FormPrinting';
import FormInventory from './COMPONENTS/FormInventory';
import FormSpecimen from './COMPONENTS/FormSpecimen';
import FormOrder from './COMPONENTS/FormOrder';

const router = createBrowserRouter([

  {
    path: "/PerpareBook",
    element: <Form1 />,
  },
  {
    path: "/addSpecimen",
    element: <FormSpecimen />,
  },
  {
    path: "/addInventory",
    element: <FormInventory />,
  },
  {
    path: "/addPrint",
    element: <FormPrinting />,
  },
  {
    path: "/addDTP",
    element: <FormDTP />,
  }, {
    path: "/addForm",
    element: <FormOrder />,
  },
  {
    path: "/",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);