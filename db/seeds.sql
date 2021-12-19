INSERT INTO department (name)
VALUES
('IT'),
('Accounting & Finance'),
('Sales & Marketing'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 80000, 1),
('Software Engineer', 120000, 1),
('Accountant', 100000, 2), 
('Finanical Analyst', 150000, 2),
('Marketing Coordindator', 70000, 3), 
('Sales Lead', 90000, 3),
('Project Manager', 100000, 4),
('Operations Manager', 90000, 4);

INSERT INTO employee ( first_name, last_name, role_id, manager_id)
VALUES
('Richard', 'Hendricks', 2, null),
('Erlich', 'Bachman', 5, 1),
('Nelson', 'Bighetti', 4, 1),
('Bertram', 'Gilfoyle', 2, null),
('Jared', 'Dunn', 3, 1),
('Monica', 'Hall', 8, null),
('Jiang', 'Yang', 1, 1),
('Gavin', 'Belsom', 3, 1),
('Dinesh', 'Chugtai', 7, 1);