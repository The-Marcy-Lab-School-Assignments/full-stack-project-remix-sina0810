import { createApplication } from '../adapters/application-adapters';

function AddApplicationForm({ loadApplications }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const company_name = form.elements.company_name.value;
    const job_title = form.elements.job_title.value;
    const description = form.elements.description.value;
    const work_type = form.elements.work_type.value;
    const salary = form.elements.salary.value;
    const date_applied = form.elements.date_applied.value;

    if (!company_name || !job_title || !date_applied) return;
  
    const { error } = await createApplication(company_name, job_title, description, work_type, salary, date_applied);
    if (error) return console.error(error);

    await loadApplications();
    form.reset();
  };

  return (
    <form id="add-application-form" onSubmit={handleSubmit}>
      <label htmlFor="company_name-input">Company Name <span style={{color: 'red'}}>*</span></label>
      <input type="text" name="company_name" id="company_name-input" placeholder="Compnay name" required/>

      <label htmlFor="job_title">Job Title <span style={{color: 'red'}}>*</span></label>
      <input type="text" name="job_title" id="job_title-input" placeholder="Job title" required/>

      <label htmlFor="description">Description</label>
      <input type="text" name="description" id="description-input" placeholder="Description " />

      <label htmlFor="work_type">Work Type</label>
      <select name="work_type" id="work_type-input">
        <option value="">Select work type</option>
        <option value="remote">Remote</option>
        <option value="hybrid">Hybrid</option>
        <option value="onsite">Onsite</option>
      </select>

      <label htmlFor="salary">Salary</label>
      <input type="number" name="salary" id="salary-input" placeholder="Salary"/>

      <label htmlFor="date_applied">Date Applied <span style={{color: 'red'}}>*</span></label>
      <input type="date" name="date_applied" id="date_applied-input" placeholder="Date Applied required" required/>

      <button type="submit">Add</button>
    </form>
  );
}

export default AddApplicationForm;
