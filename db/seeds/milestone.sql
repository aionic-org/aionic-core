/*

  ##### Global database seeding #####

  Run the following command after all tables were created:
  'yarn seed milestone'

*/

/* Insert task status */
INSERT INTO task_status (title, sort, max, color)
VALUES	('Open', 1, 0, '#0984e3'),
				('Working', 2, 14, '#00b894'),
				('Testing', 3, 10, '#fdcb6e'),
				('Bugfix', 4, 8, '#d63031'),
				('Review', 5, 5, '#e17055'),
				('Done', 6, 0, '#636e72');

/* Insert task priorities */
INSERT INTO task_priority (title, value)
VALUES	('Low', 1),
				('Medium', 2),
				('High', 3);
