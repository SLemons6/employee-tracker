use employees;

INSERT INTO department
     (name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO role
     (title, salary, department_id)
VALUES
    ('Lead Engineer', 125000, 1),
    ('Software Engineer', 100000, 1),
    ('Account Manager', 110000, 2),
    ('Accountant', 90000, 2),
    ('Legal Team Lead', 225000, 3),
    ('Lawyer', 175000, 3),
    ('Sales Lead', 100000, 4),
    ('Salesperson', 50000.00, 4);

INSERT INTO employee
     (first_name, last_name, role_id, manager_id)
VALUES
    ('Bruce', 'Wayne', 1, NULL),
    ('Clark', 'Kent', 2, 1),
    ('Barry', 'Allen', 3, NULL),
    ('Wally', 'West', 4, 3),
    ('Peter', 'Parker', 5, NULL),
    ('Miles', 'Morales', 6, 5),
    ('Diana', 'Prince', 7, NULL),
    ('Jim', 'Gordon', 8, 7);