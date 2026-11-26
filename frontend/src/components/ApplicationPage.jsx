import { useState, useEffect } from 'react';
import { fetchAllApplications, createApplication } from '../adapters/application-adapters';
import AddApplicationForm from './AddApplicationForm';
import ApplicationList from './ApplicationList';

function ApplicationPage({ currentUser, handleLogout }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This helper fetches applications on page load with useEffect
  // It is also used within the AddApplicationForm and ApplicationList
  // to re-fetch the applications when a mutation action is performed
  // such as creating, deleting, or updating a application.
  const loadApplications = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllApplications();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setApplications(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Passed to AddApplicationForm as onAdd.
  // Saves the job, reloads the list, and returns true so the form clears.
  const handleAddApplication = async (application) => {
    const { company_name, job_title, description, work_type, salary, date_applied } = application;
    const { error } = await createApplication(company_name, job_title, description, work_type, salary, date_applied);
    if (error) {
      console.error(error);
      return false;
    }
    await loadApplications();
    return true;
  };

  return (
    <section>
      <div id="user-controls">
        <span>Welcome, <strong>{currentUser.username}</strong>!</span>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <AddApplicationForm onAdd={handleAddApplication} />
      {isLoading && <p>Loading applications...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      <ApplicationList applications={applications} loadApplications={loadApplications} />
    </section>
  );
}

export default ApplicationPage;
