const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  // Drop tables in reverse dependency order (todos references users via FK)
  await pool.query('DROP TABLE IF EXISTS applications CASCADE');
  await pool.query('DROP TABLE IF EXISTS users CASCADE');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE applications (

      application_id     SERIAL PRIMARY KEY,
      company_name 	TEXT NOT NULL,
      job_title		TEXT NOT NULL,
      description		TEXT ,
      work_type		TEXT ,
      salary			INTEGER ,
      status			TEXT NOT NULL,
      date_applied	DATE,
      user_id 		INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  // Hash passwords in parallel — bcrypt is slow by design (CPU-bound hashing)
  const [aliceHash, bobHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  // RETURNING captures inserted user_ids so we don't hardcode them
  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) VALUES
      ('alice', $1),
      ('bob',   $2)
    RETURNING user_id, username
  `, [aliceHash, bobHash]);

  const [alice, bob] = users;

  await pool.query(`
    INSERT INTO applications (company_name, job_title, description, work_type, salary, status, date_applied, user_id) VALUES
      ('Amazon', 'Full-stack engineer', 'Responsable for building and reading code', 'remote', 100000, 'Pending', '2026-05-14', $1),
      ('Google', 'Frontend Developer', 'Building user interfaces with React', 'hybrid', 120000, 'Interviewing', '2026-05-10', $1),
      ('Meta', 'Software Engineer', 'Working on large scale web applications', 'remote', 130000, 'Applied', '2026-05-08', $1),
      ('Netflix', 'React Developer', 'Building and maintaining streaming UI', 'remote', 115000, 'Rejected', '2026-05-01', $1),
      ('Apple', 'Full-stack Developer', 'Developing internal tools and APIs', 'onsite', 125000, 'Pending', '2026-05-12', $2),
      ('Spotify', 'Backend Engineer', 'Building REST APIs with Node and Express', 'hybrid', 110000, 'Interviewing', '2026-05-05', $2),
      ('Twitter', 'Junior Developer', 'Maintaining and improving existing codebase', 'remote', 95000, 'Applied', '2026-05-03', $2),
      ('Microsoft', 'Software Engineer', 'Working on cloud based web applications', 'hybrid', 118000, 'Offer', '2026-04-28', $2)
  `, [alice.user_id, bob.user_id]);

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
