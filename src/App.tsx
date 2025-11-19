import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config/firebase';
import { ConsolePage } from './pages/ConsolePage';
import { LoginPage } from './pages/LoginPage';
import './App.scss';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div data-component="App" className="app-loading">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  // Show LoginPage or ConsolePage based on authentication state
  return (
    <div data-component="App">
      {user ? (
        <ConsolePage userId={user.uid} />
      ) : (
        <LoginPage onLogin={(userId) => {
          // User is automatically set by onAuthStateChanged
          console.log('User logged in:', userId);
        }} />
      )}
    </div>
  );
}

export default App;
