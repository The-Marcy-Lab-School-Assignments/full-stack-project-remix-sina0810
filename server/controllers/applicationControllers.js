const applicationModel = require('../models/applicationModel');

module.exports.listApplication = async (req, res, next) => {
  try {
    const applications = await applicationModel.listByUser(req.session.user_id);
    res.send(applications);
  } catch (err) {
    next(err);
  }
};

module.exports.createApplication = async (req, res, next) => {
  try {
    const { company_name, job_title, description, work_type, salary, date_applied } = req.body;
    const parsedSalary = salary ? parseInt(salary) : null;
    if (!company_name || !job_title || !date_applied) return res.status(400).send({ error: 'company name, job title, date applied is required.' });
    const application = await applicationModel.create(company_name, job_title, description, work_type, parsedSalary, date_applied, req.session.user_id);
    res.status(201).send(application);
  } catch (err) {
    next(err);
  }
};

module.exports.updateApplication = async (req, res, next) => {
  try {
    const { application_id } = req.params;
    const application = await applicationModel.find(application_id);
    if (!application) return res.status(404).send({ error: 'Application not found.' });
    if (application.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedApplication = await applicationModel.update(application_id, req.body);
    res.send(updatedApplication);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteApplication = async (req, res, next) => {
  try {
    const { application_id } = req.params;

    // First find the todo to verify ownership
    const application = await applicationModel.find(application_id);
    if (!application) return res.status(404).send({ error: 'Application not found.' });
    if (application.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    // Destroy the application only after ownership has been verified
    const destroyedApplication = await applicationModel.destroy(application_id);
    res.send(destroyedApplication);
  } catch (err) {
    next(err);
  }
};
