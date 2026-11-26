function AddApplicationForm({ onAdd }) {
    const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Collect all the values into one object
    const application = {
      company_name: form.elements.company_name.value,
      job_title: form.elements.job_title.value,
      description: form.elements.description.value,
      work_type: form.elements.work_type.value,
      salary: form.elements.salary.value,
      date_applied: form.elements.date_applied.value,
    };

    if (!application.company_name || !application.job_title || !application.date_applied) return;

    // Hand the data to the parent. If it returns true, clear the form.
    const success = await onAdd(application);
    if (success) form.reset();
  };

  return (
    <form id="add-application-form" onSubmit={handleSubmit}>
      <label htmlFor="company_name-input">Company Name <span style={{color: 'red'}}>*</span></label>
      <input type="text" name="company_name" id="company_name-input" placeholder="Company name" required/>

      <label htmlFor="job_title-input">Job Title <span style={{color: 'red'}}>*</span></label>
      <input type="text" name="job_title" id="job_title-input" placeholder="Job title" required/>

      <label htmlFor="description-input">Description</label>
      <input type="text" name="description" id="description-input" placeholder="Description " />

      <label htmlFor="work_type-input">Work Type</label>
      <select name="work_type" id="work_type-input">
        <option value="">Select work type</option>
        <option value="remote">Remote</option>
        <option value="hybrid">Hybrid</option>
        <option value="onsite">Onsite</option>
      </select>

      <label htmlFor="salary-input">Salary</label>
      <input type="number" name="salary" id="salary-input" placeholder="Salary"/>

      <label htmlFor="date_applied-input">Date Applied <span style={{color: 'red'}}>*</span></label>
      <input type="date" name="date_applied" id="date_applied-input" placeholder="Date Applied required" required/>

      <button type="submit">Add</button>
    </form>
  );
}

export default AddApplicationForm;
