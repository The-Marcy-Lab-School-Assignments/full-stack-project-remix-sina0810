import { useState, useEffect } from 'react';
import { getMe, login, register, logout } from './adapters/auth-adapters';
import AuthPage from './components/AuthPage';
import ApplicationPage from './components/ApplicationPage';

import { createApplication } from './adapters/application-adapters';
import LandingPage from './components/LandingPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // false = show the landing page, true = show the login/register page
  const [showLogin, setShowLogin] = useState(false);

  // On every page load, check the server for an active session cookie.
  // React state doesn't survive a refresh; session cookies do.
  useEffect(() => {
    const checkForSession = async () => {
      const { data: user } = await getMe();
      setCurrentUser(user);
    };
    checkForSession();
  }, []);

  // Handlers that manage updating the current user. 
  // Defined in App to ensure that child components only                       
  // update the current user in a controlled manner.  
  const handleLogin = async (username, password) => {
    const { data: user, error } = await login(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  // pendingApplication is optional. Only the landing page sends it.
  // The register form on AuthPage still calls handleRegister(username, password).
  const handleRegister = async (username, password, pendingApplication) => {
    const { data: user, error } = await register(username, password);
    if (error) return error;

    // Save the job they typed BEFORE showing the tracker.
    // If we called setCurrentUser first, ApplicationPage would load the list
    // before this job existed, and it wouldn't show up.
    if (pendingApplication) {
      const { company_name, job_title, description, work_type, salary, date_applied } = pendingApplication;
      await createApplication(company_name, job_title, description, work_type, salary, date_applied);
    }

    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setShowLogin(false);
  };

  
  // Three possible pages, so an if/else is clearer than a nested ternary.
  let page;
  if (currentUser) {
    page = <ApplicationPage currentUser={currentUser} handleLogout={handleLogout} />;
  } else if (showLogin) {
    page = (
      <>
        <button type="button" className="link-button" onClick={() => setShowLogin(false)}>
          ← Back
        </button>
        <AuthPage handleLogin={handleLogin} handleRegister={handleRegister} />
      </>
    );
  } else {
    page = <LandingPage handleRegister={handleRegister} showLoginPage={() => setShowLogin(true)} />;
  }

  return (
    <main>
      <h1>Application App</h1>
      {page}
    </main>
  );
}

export default App;
