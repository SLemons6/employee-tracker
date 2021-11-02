INSERT INTO departments
(name)
VALUES ('Sales');

INSERT INTO ROLES
(title, salary, department_id)
VALUES ('Salesperson', 50000.00, (SELECT id FROM departments WHERE name = 'Sales'));

INSERT INTO employees 
(first_name, last_name, role_id)
VALUES 
('John', 'Doe', (SELECT id FROM roles WHERE title='Salesperson'));