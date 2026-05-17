import ApplicationItem from './ApplicationItem';

function ApplicationList({ applications, loadApplications }) {
  return (
    <ul id="application-list">
      {applications.map((application) => (
        <ApplicationItem
          key={application.application_id}
          application={application}
          loadApplications={loadApplications}
        />
      ))}
    </ul>
  );
}

export default ApplicationList;
