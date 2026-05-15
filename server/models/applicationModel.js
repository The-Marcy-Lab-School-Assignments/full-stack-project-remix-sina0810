const pool = require('../db/pool');

// Returns all applications for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM applications WHERE user_id = $1 ORDER BY application_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single application row (used for ownership checks before update/delete)
module.exports.find = async (application_id) => {
  const query = 'SELECT * FROM applications WHERE application_id = $1';
  const { rows } = await pool.query(query, [application_id]);
  return rows[0] || null;
};

// Creates a new application. Returns the full application row.
module.exports.create = async (company_name, job_title, description, work_type, salary, date_applied, user_id) => {
  const query = `INSERT INTO applications (company_name, job_title, description, work_type, salary, status, date_applied, user_id) VALUES ($1, $2, $3, $4, $5, 'Applied', $6, $7) RETURNING *`;
  const { rows } = await pool.query(query, [company_name, job_title, description, work_type, salary, date_applied, user_id]);
  return rows[0];
};

// Updates status for a application. Returns the updated row.
module.exports.update = async (application_id, { status }) => {
  const query = 'UPDATE applications SET status = $1 WHERE application_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [status, application_id]);
  return rows[0];
};

// Deletes an application by id
module.exports.destroy = async (application_id) => {
  const query = 'DELETE FROM applications WHERE application_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [application_id]);
  return rows[0] || null;
};
