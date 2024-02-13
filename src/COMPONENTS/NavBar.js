import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { BooksTable } from '../TABLES/BooksTable';
import FormDTP from './FormDTP';
import logo from "../IMAGES/logo.jpeg"
import "../SYLES/Book.css"
import FormPrinting from './FormPrinting';
import FormInventory from './FormInventory';
import FormDispatch from './FormDispatch';
import PrepareBooks from '../PAGES/PrepareBooks';
import { DTPTable } from '../TABLES/DTPTable';
import { Height } from '@mui/icons-material';
import PrintingTable from '../TABLES/PrintingTable';
import InventoryTable from '../TABLES/InventoryTable';
import SMTable from '../TABLES/SpecimenManagementTable';
import Invoice from './Invoice';
import FormTable from '../TABLES/FormTable';
import InvoiceTable from '../TABLES/InvoiceTable';
import IncomeTable from '../TABLES/IncomeTable';
import ExpenseTable from '../TABLES/ExpenseTable';
import OrderTable from '../TABLES/OrderTable';
import PendingTable from '../TABLES/PendingTable';

const drawerWidth = 240;

export default function NavBar() {
    const [navLive, setNavLive] = useState(1);
    const [selectedLink, setSelectedLink] = useState("Prepare Books");

    const handleLinkClick = (index, text) => {
        setNavLive(index);
        setSelectedLink(text);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                style={{ backgroundColor: "#aa1112" }}
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Toolbar>
                    <div>
                        <Typography variant="h6" noWrap component="div">
                            {selectedLink}
                        </Typography>
                        
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: "#aa1112",
                        color: "#fff"
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <img className='logo' src={logo} />
                <Divider />
                <List>
                    {['Prepare Books', 'DTP', 'Printing', 'Inventory', 'Specimen Management', 'Order Form', 'Pending Books', 'Income', 'Invoice', 'Add Bill'].map((text, index) => (
                        <ListItem key={text} disablePadding onClick={() => handleLinkClick(index + 1, text)}>
                            <ListItemButton>
                                <ListItemIcon style={{ color: "#fff" }}>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />

                {navLive === 1 ? <BooksTable /> : false}
                {navLive === 2 ? <DTPTable /> : false}
                {navLive === 3 ? <PrintingTable /> : false}
                {navLive === 4 ? <InventoryTable /> : false}
                {navLive === 5 ? <SMTable /> : false}
                {navLive === 6 ? <OrderTable /> : false}
                {navLive === 7 ? <PendingTable /> : false}
                {navLive === 8 ? <IncomeTable /> : false}
                {navLive === 9 ? <InvoiceTable /> : false}
                {navLive === 10 && window.location.assign('https://kvpublication-invoicegenerator.web.app/creditbalance')}

            </Box>
        </Box>
    );
}
