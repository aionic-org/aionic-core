/*

  ##### Aionic database seeding #####

  Run the following command after all tables were created:
  'yarn run seed'

*/


/* Insert user roles */
INSERT INTO user_role (name)
VALUES  ('Admin'),
        ('User');

/* Insert task status */
INSERT INTO task_status (title, sort, active)
VALUES  ('Open', 1, 1),
        ('Development', 2, 1),
        ('Testing', 3, 1),
        ('Code Review', 4, 1),
        ('Bugfix', 5, 1),
        ('Done', 6, 1);

/* Insert task priorities */
INSERT INTO task_priority (title, value)
VALUES  ('Low', 1),
        ('Medium', 2),
        ('High', 3);
