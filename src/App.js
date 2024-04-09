import React, { useState, useEffect } from 'react';
import HomePage from './PAGES/HomePage';
import '../src/App.css';
import firebaseApp from './Firebasse';
import Signin from './PAGES/Signin';
import {useNavigate} from 'react-router-dom';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Function to check login status
  const checkLoginStatus = async () => {
    try {
      const adminRef = firebaseApp.firestore().collection('Admin');
      const snapshot = await adminRef.where('isLoggedIn', '==', true).get();
      if (snapshot.empty) {
        console.log('No matching documents.');
        setLoggedIn(false);
        navigate('/signin');
      } else {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          setLoggedIn(true);
        });
      }
    } catch (err) {
      console.error('Error getting documents: ', err);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // Call checkLoginStatus when the component mounts
  }, []); // Empty dependency array means it only runs once after the component mounts

  // Render homepage if loggedIn is true, else render signin page
  return (
    <div>
      {loggedIn ? <HomePage /> : <Signin />}
    </div>
  );
}

export default App;
