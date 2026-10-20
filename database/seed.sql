INSERT INTO personal
    (title, first_name, middle_name, last_name, date_of_birth, gender, marital_status,
     nationality, id_type, id_number, id_expiry_date, email, mobile_number,
     occupation, employment_status)
VALUES
('Ms', 'Selma', NULL, 'Nghipandulwa', '1994-03-17', 'FEMALE', 'SINGLE', 'Namibia', 'NATIONAL_ID', '94031700123', NULL, 'selma.nghipandulwa@gmail.com', '+264811234567',
	'Accountant', 'EMPLOYED'),
('Mr', 'Johannes',  NULL, 'Amutenya', '1988-07-02', 'MALE', 'MARRIED', 'Namibia', 'NATIONAL_ID', '88070200456', NULL, 'johannes.amutenya@gmail.com', '+264812345678',
	'Civil engineer', 'EMPLOYED'),
('Dr', 'Maria', 'Ndeshi', 'Kandjii', '1979-11-25', 'FEMALE', 'MARRIED', 'Namibia', 'PASSPORT', 'A1234567', '2030-05-14', 'maria.kandjii@outlook.com', '+264813456789',
	'Medical doctor', 'SELF_EMPLOYED'),
('Mr', 'Pieter',  NULL, 'van Wyk', '1965-01-30', 'MALE', 'DIVORCED', 'South Africa', 'DRIVERS_LICENCE', 'DL778899', '2029-09-30', 'pieter.vanwyk@icloud.com', '+264814567890',
	'Farmer', 'SELF_EMPLOYED'),
('Miss', 'Tuyeni', NULL, 'Haufiku', '2001-09-12', 'FEMALE', 'SINGLE', 'Namibia', 'NATIONAL_ID', '01091200789', NULL, 'tuyeni.haufiku@gmail.com', '+264815678901', 'Student', 'STUDENT'),
('Mrs', 'Rebecca', NULL, 'O''Brien', '1983-04-08', 'FEMALE', 'MARRIED', 'Ireland', 'PASSPORT', 'PA5566778', '2031-02-28', 'rebecca.obrien@outlook.com', '+264816789012',
	'Teacher', 'EMPLOYED'),
('Mr', 'Festus', NULL, 'Iipinge', '1990-12-05', 'MALE', 'SINGLE', 'Namibia', 'NATIONAL_ID', '90120500321', NULL, 'festus.iipinge@gmail.com', '+264817890123',
	'Electrician', 'EMPLOYED'),
('Ms', 'Linda', NULL, 'Mbala', '1975-06-19', 'FEMALE', 'WIDOWED', 'Zambia', 'PASSPORT', 'ZN4433221', '2028-12-01', 'linda.mbala@icloud.com', '+264818901234',
NULL, 'UNEMPLOYED'),
('Prof', 'Emmanuel', NULL, 'Tjivikua', '1968-08-14', 'MALE', 'MARRIED', 'Namibia', 'NATIONAL_ID', '68081400654', NULL, 'emmanuel.tjivikua@gmail.com', '+264819012345',
	'Lecturer', 'EMPLOYED'),
('Mr', 'David', NULL, 'Shilongo', '1958-02-27', 'MALE', 'WIDOWED', 'Namibia', 'NATIONAL_ID', '58022700987', NULL, 'david.shilongo@outlook.com', '+264810123456', 'Retired teacher', 'RETIRED'
);

SELECT * FROM personal

INSERT INTO address (personal_id, address_type, address_line_1, address_line_2, suburb, city, district, postal_code, country, residential_status)
SELECT p.id, v.address_type, v.address_line_1, v.address_line_2, v.suburb, v.city, v.district,
       v.postal_code, v.country, v.residential_status
FROM (VALUES
    ('NATIONAL_ID', '94031700123', 'RESIDENTIAL', '12 Mandume Ndemufayo Ave', 'Unit 4', 'Klein Windhoek', 'Windhoek', 'Khomas', '9000', 'Namibia', 'RENTING'),
    ('NATIONAL_ID', '94031700123', 'POSTAL', 'PO Box 1520', NULL, NULL, 'Windhoek', 'Khomas', '9000', 'Namibia', NULL),
    ('NATIONAL_ID', '88070200456', 'RESIDENTIAL', '45 Sam Nujoma Drive', NULL, 'Olympia', 'Windhoek', 'Khomas', '9000', 'Namibia', 'OWNER'),
    ('NATIONAL_ID', '88070200456', 'POSTAL', '45 Sam Nujoma Drive', NULL, 'Olympia', 'Windhoek', 'Khomas', '9000', 'Namibia', NULL),
    ('PASSPORT', 'A1234567', 'RESIDENTIAL', '7 Nelson Mandela Ave', NULL, 'Eros', 'Windhoek', 'Khomas', '9000', 'Namibia', 'OWNER'),
    ('PASSPORT', 'A1234567', 'POSTAL', 'PO Box 22210', NULL, NULL, 'Windhoek', 'Khomas', '9000', 'Namibia', NULL),
    ('DRIVERS_LICENCE', 'DL778899', 'RESIDENTIAL', 'Farm Sonop', 'Road D1250', NULL, 'Mariental', 'Hardap',  NULL, 'Namibia', 'OWNER'),
    ('NATIONAL_ID', '01091200789', 'RESIDENTIAL', 'Room 214, Student Hostel', 'NUST Campus', 'Academia', 'Windhoek', 'Khomas', '9000', 'Namibia', 'OTHER'),
    ('NATIONAL_ID', '01091200789', 'POSTAL', 'Room 214, Student Hostel', 'NUST Campus', 'Academia', 'Windhoek', 'Khomas', '9000', 'Namibia', NULL),
    ('PASSPORT', 'PA5566778', 'RESIDENTIAL', '88 Tobias Hainyeko St', NULL, 'Katutura', 'Windhoek', 'Khomas', '9000', 'Namibia', 'RENTING')
) AS v(id_type, id_number, address_type, address_line_1, address_line_2, suburb, city, district, postal_code, country, residential_status)
JOIN personal p ON p.id_type = v.id_type AND p.id_number = v.id_number;

SELECT * FROM address

INSERT INTO personal_onboarding (personal_id, status, current_step, submitted_at, created_at, updated_at)
SELECT p.id, v.status, v.current_step, v.submitted_at::timestamp,
       v.created_at::timestamp, v.updated_at::timestamp
FROM (VALUES
    ('NATIONAL_ID', '94031700123', 'SUBMITTED', 3, '2026-10-05 09:40:00', '2026-10-05 09:12:00', '2026-10-05 09:40:00'),
    ('NATIONAL_ID', '88070200456', 'SUBMITTED', 3, '2026-10-06 10:31:00', '2026-10-06 10:05:00', '2026-10-06 10:31:00'),
    ('PASSPORT', 'A1234567', 'SUBMITTED', 3, '2026-10-07 15:02:00', '2026-10-07 14:20:00', '2026-10-07 15:02:00'),
    ('DRIVERS_LICENCE', 'DL778899', 'SUBMITTED', 3, '2026-10-08 09:15:00', '2026-10-08 08:45:00', '2026-10-08 09:15:00'),
    ('NATIONAL_ID', '01091200789', 'DRAFT', 3, NULL, '2026-10-12 11:00:00', '2026-10-12 11:25:00'),
    ('PASSPORT', 'PA5566778', 'DRAFT', 3, NULL, '2026-10-13 13:10:00', '2026-10-13 13:44:00'),
    ('NATIONAL_ID', '90120500321', 'DRAFT', 2, NULL, '2026-10-15 09:30:00', '2026-10-15 09:36:00'),
    ('PASSPORT', 'ZN4433221', 'DRAFT', 2, NULL, '2026-10-16 15:00:00', '2026-10-16 15:08:00'),
    ('NATIONAL_ID', '68081400654', 'DRAFT', 1, NULL, '2026-10-18 10:10:00', '2026-10-18 10:10:00'),
    ('NATIONAL_ID', '58022700987', 'DRAFT', 1, NULL, '2026-10-19 08:30:00', '2026-10-19 08:30:00')
) AS v(id_type, id_number, status, current_step, submitted_at, created_at, updated_at)
JOIN personal p ON p.id_type = v.id_type AND p.id_number = v.id_number;

SELECT * FROM personal_onboarding