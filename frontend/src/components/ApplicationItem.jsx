import { updateApplication, deleteApplication } from '../adapters/application-adapters';

function ApplicationItem({ application, loadApplications }) {
  const handleChange = async (e) => {
    const { error } = await updateApplication(application.application_id, { status: e.target.value });
    if (error) return console.error(error);
    loadApplications();
  };

  const handleDelete = async () => {
    const { error } = await deleteApplication(application.application_id);
    if (error) return console.error(error);
    loadApplications();
  };

  return (
    <li className="application-item">
      <span>{application.company_name}</span>
      <span>{application.job_title}</span>
      <span>{application.description}</span>
      <span>{application.work_type}</span>
      <label style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Status</label>

      <select 
        value={application.status}
        onChange={handleChange}
      >
        <option value="Applied">Applied</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>
      <button className="delete-btn" onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default ApplicationItem;
