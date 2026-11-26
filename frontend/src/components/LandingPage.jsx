import { useState } from 'react';
import AddApplicationForm from './AddApplicationForm';

// Props come from App.jsx (we wire them up in Step 4):
//   handleRegister  - creates the account (and saves the job)
//   showLoginPage   - switches to the existing login page

function LandingPage({  handleRegister, showLoginPage }) {
    const [pendingApplication, setPendingApplication] = useState(null);

    const [username, setUsername ] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

// Passed to AddApplicationForm as onAdd.
// Instead of saving to the database, we hold the job in state.
// Returning false tells the form NOT to clear, so "Back" keeps their input.
  
const handleAdd = (application) => {
    setPendingApplication(application);
    return false;
};

const handleSignUp = async (e) => {
    e.preventDefault();
    const error = await handleRegister(username, password, pendingApplication);
    if (error) {
      setErrorMessage('Could not create account. That username may be taken.');
    }
  }; 

return (
    <section id="landing">
      <div id="landing-top">
        <button type="button" className="link-button" onClick={showLoginPage}>
          Log in
        </button>
      </div>

      {/* Step 1: the job form. We HIDE it instead of removing it,
          so the values they typed are still there if they click Back. */}
      <div hidden={pendingApplication !== null}>
        <h2>Keep track of every job you apply to.</h2>
        <p>Add your first one below.</p>
        <AddApplicationForm onAdd={handleAdd} />
      </div>

      {/* Step 2: only rendered once they've clicked Add */}
      {pendingApplication && (
        <form id="signup-step" onSubmit={handleSignUp}>
          <h2>Create an account to save this job</h2>
          <p>
            <strong>{pendingApplication.job_title}</strong> at{' '}
            <strong>{pendingApplication.company_name}</strong>
          </p>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMessage && <p className="error">{errorMessage}</p>}
          <button type="submit">Sign up</button>

          <p>
            Already have an account?{' '}
            <button type="button" className="link-button" onClick={showLoginPage}>
              Log in
            </button>
          </p>
          <button type="button" className="link-button" onClick={() => setPendingApplication(null)}>
            ← Back
          </button>
        </form>
      )}
    </section>
  );
}

export default LandingPage;
