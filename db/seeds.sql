/*

  ##### Aionic database seeding #####

  Run the following command after all tables were created:
  'yarn run seed'

*/


/* Insert user roles */
INSERT INTO user_role (name)
VALUES	('Admin'),
				('User');

/* Insert admin account */
INSERT INTO user (email, firstname, lastname, password, userRoleId)
VALUES	('admin@aionic-core.com', 'Admin', 'Admin', ?, 1);

/* Insert task status */
INSERT INTO task_status (title, sort)
VALUES	('To Do', 1),
				('In Progress', 2),
				('Testing', 3),
				('Bugfix', 4),
				('In Review', 5),
				('Done', 6);

/* Insert task priorities */
INSERT INTO task_priority (title, value)
VALUES	('Low', 1),
				('Medium', 2),
				('High', 3);
