import React from 'react';
import ReactDOM from 'react-dom';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from './App';
import Form1 from './COMPONENTS/FormBook';
import FormSpecimen from './COMPONENTS/FormSpecimen';
import BooksTable from './TABLES/BooksTable';
import SMTable from './TABLES/SpecimenManagementTable';
import InventoryTable from './TABLES/InventoryTable';
import PrintingTable from './TABLES/PrintingTable';
import InvoiceTable from './TABLES/InvoiceTable';
import DTPTable from './TABLES/DTPTable';
import OrderTable from './TABLES/OrderTable';
import PendingTable from './TABLES/PendingTable';
import IncomeTable from './TABLES/IncomeTable';



const router = createBrowserRouter([

  {
    path: "/PrepareBooks",
    element: <BooksTable />,
  },
  {
    path: "/SpecimenManagement",
    element: <SMTable />,
  },
  {
    path: "/Inventory",
    element: <InventoryTable />,
  },
  {
    path: "/Printing",
    element: <PrintingTable />,
  },
  {
    path: "/Invoice",
    element: <InvoiceTable />,
  },
  {
    path: "/DTP",
    element: <DTPTable />,
  },
  {
    path: "/OrderForm",
    element: <OrderTable />,
  },
  {
    path: "/PendingBooks",
    element: <PendingTable />,
  },
  {
    path: "/CreditNote",
    element: <IncomeTable />,
  },

  {
    path: "/PerpareBook",
    element: <Form1 />,
  },
  {
    path: "/addSpecimen",
    element: <FormSpecimen />,
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