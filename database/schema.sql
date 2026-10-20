CREATE TABLE personal (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
title VARCHAR(10) NOT NULL, CONSTRAINT check_title CHECK (title IN ('Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof')),
first_name VARCHAR(50) NOT NULL,
middle_name VARCHAR(50),
last_name VARCHAR(50) NOT NULL,
date_of_birth DATE NOT NULL,
gender VARCHAR(10) NOT NULL, CONSTRAINT check_gender CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
marital_status VARCHAR(15) NOT NULL CONSTRAINT ck_personal_marital CHECK (marital_status IN ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED')),
nationality VARCHAR(60) NOT NULL,
id_type VARCHAR(20) NOT NULL, CONSTRAINT check_id_type CHECK (id_type IN ('NATIONAL_ID', 'PASSPORT', 'DRIVERS_LICENCE')),
id_number VARCHAR(30) NOT NULL,
id_expiry_date DATE, CONSTRAINT check_id_expiry CHECK (id_type = 'NATIONAL_ID' OR id_expiry_date IS NOT NULL),
email VARCHAR(150) NOT NULL,
mobile_number VARCHAR(20) NOT NULL,
occupation VARCHAR(100),
employment_status VARCHAR(20) NOT NULL, CONSTRAINT check_employment_status CHECK (employment_status IN ('EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'STUDENT', 'RETIRED')),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE address (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
personal_id BIGINT NOT NULL REFERENCES personal (id) ON DELETE CASCADE,
address_type VARCHAR(12) NOT NULL, CONSTRAINT unique_address_type UNIQUE (personal_id, address_type),
address_line_1 VARCHAR(100) NOT NULL,
address_line_2 VARCHAR(100),
suburb VARCHAR(60),
city VARCHAR(60) NOT NULL,
district VARCHAR(60),
postal_code VARCHAR(10),
country VARCHAR(60) NOT NULL,
residential_status VARCHAR(20),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT check_address_type CHECK (address_type IN ('RESIDENTIAL', 'POSTAL')),
CONSTRAINT check_address_status CHECK (residential_status IS NULL OR residential_status IN ('OWNER', 'RENTING', 'FAMILY', 'OTHER')),
CONSTRAINT check_address_res_required CHECK (address_type <> 'RESIDENTIAL' OR residential_status IS NOT NULL)
);

CREATE TABLE personal_onboarding (
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
personal_id BIGINT NOT NULL UNIQUE REFERENCES personal (id) ON DELETE CASCADE,
status VARCHAR(12) NOT NULL DEFAULT 'DRAFT', CONSTRAINT check_onboarding_status CHECK (status IN ('DRAFT', 'SUBMITTED')),
current_step SMALLINT NOT NULL DEFAULT 1, CONSTRAINT check_onboarding_step CHECK (current_step IN(1, 2, 3)),
submitted_at TIMESTAMP,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX index_personal_last_first
ON personal (last_name, first_name);
 
CREATE INDEX index_onboarding_status_updated
ON personal_onboarding (status, updated_at);