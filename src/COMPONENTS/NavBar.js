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
import logo from "../IMAGES/logo.jpeg"
import "../SYLES/Book.css"
import { DTPTable } from '../TABLES/DTPTable';
import PrintingTable from '../TABLES/PrintingTable';
import InventoryTable from '../TABLES/InventoryTable';
import SMTable from '../TABLES/SpecimenManagementTable';
import InvoiceTable from '../TABLES/InvoiceTable';
import OrderTable from '../TABLES/OrderTable';
import PendingTable from '../TABLES/PendingTable';
import LedgerTable from '../TABLES/LedgerTable';
import DaybookTable from '../TABLES/DaybookTable';
import DistributorTable from '../TABLES/DistributorsTable';
import Home from '../TABLES/Home';
import { useNavigate } from 'react-router-dom';
import firebaseApp from '../Firebasse';


const drawerWidth = 240;

export default function NavBar() {
    const [navLive, setNavLive] = useState(0);  // Set the initial state to 0
    const [selectedLink, setSelectedLink] = useState("KV Publishers"); // Set the initial selected link
    const navigate = useNavigate();

    const handleLinkClick = (index, text) => {
        setNavLive(index);
        setSelectedLink(text);
    };

    const handleLogoClick = () => {
        setNavLive(0);
        setSelectedLink("KV Publishers");
    }

    const handleSignOut = () => {
        // Update the isLoggedIn field to false in Firestore
        const adminRef = firebaseApp.firestore().collection('Admin');
        // set the isLoggedIn field to false
        adminRef.doc('YcY68bRONX2Hi7euVWBc').update({
            isLoggedIn: false
        }).then(() => {
            console.log('User signed out successfully!');
            // Navigate to the '/' route after signing out
            navigate('/signin');
        })
            .catch(error => {
                console.error('Error signing out:', error);
            });
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
                    <div >
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
                <img className='logo' src={logo} onClick={handleLogoClick} style={{ cursor: 'pointer' }} />


                <Divider />
                <List>
                    {['Prepare Books', 'DTP', 'Printing', 'Inventory', 'Distributors ', 'Specimen Management', 'Order Form', 'Pending Books', 'Day Book', 'Ledger', 'Credit Note'].map((text, index) => (
                        <ListItem key={text} disablePadding onClick={() => handleLinkClick(index + 1, text)}>
                            <ListItemButton>
                                <ListItemIcon style={{ color: "#fff" }}>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem key="Signout" disablePadding onClick={handleSignOut}>
                        <ListItemButton>
                            <ListItemIcon style={{ color: "#fff" }}>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Signout" />
                        </ListItemButton>
                    </ListItem>

                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />
                {navLive === 0 ? <Home /> : false}
                {navLive === 1 ? <BooksTable /> : false}
                {navLive === 2 ? <DTPTable /> : false}
                {navLive === 3 ? <PrintingTable /> : false}
                {navLive === 4 ? <InventoryTable /> : false}
                {navLive === 5 ? <DistributorTable /> : false}
                {navLive === 6 ? <SMTable /> : false}
                {navLive === 7 ? <OrderTable /> : false}
                {navLive === 8 ? <PendingTable /> : false}
                {navLive === 9 ? <DaybookTable /> : false}
                {navLive === 10 ? <LedgerTable /> : false}
                {navLive === 11 ? <InvoiceTable /> : false}
                {navLive === 12 ? onclick = { handleSignOut } : false}



            </Box>
        </Box>
    );
}
