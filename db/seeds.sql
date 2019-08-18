/*

  ##### Aionic database seeding #####

  Run the following command after all tables were created:
  'yarn run seed'

*/


/* Insert user roles */
INSERT INTO user_role (name)
VALUES	('Admin'),
				('User');

/* Insert task status */
INSERT INTO task_status (title, sort)
VALUES	('Backlog', 1),
				('To Do', 2),
				('In Progress', 3),
				('Testing', 4),
				('In Review', 5),
				('Done', 6);

/* Insert task priorities */
INSERT INTO task_priority (title, value)
VALUES	('Low', 1),
				('Medium', 2),
				('High', 3);

/* Insert task types */
INSERT INTO task_type (title, sort, active)
VALUES	('Feature', 1, 1),
				('Improvement', 2, 1),
				('Bugfix', 3, 1),
				('Hotfix', 4, 1);
