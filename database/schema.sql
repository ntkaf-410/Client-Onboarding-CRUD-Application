CREATE TABLE personal(
id bigint PRIMARY KEY NOT NULL,
title VARCHAR(10) NOT NULL,
first_name VARCHAR(50) NOT NULL,
middle_name VARCHAR(50),
last_name VARCHAR(50) NOT NULL,
date_of_birth DATE NOT NULL,
gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
marital_status VARCHAR(15) NOT NULL CHECK (marital_status IN ('SINGLE', 'MARRIED', 'DOVORCED', 'WIDOWED')),
nationality VARCHAR(60) NOT NUll,
id_type VARCHAR(30) NOT NULL CHECK (id_type IN ('NATIONAL_ID', 'PASSPORT', 'DRIVERS_LICENCE')),
id_number VARCHAR(30) NOT NULL, CONSTRAINT uq_id_type_number UNIQUE (id_type, id_number),
id_expiry_date DATE,
email VARCHAR(150) NOT NULL,
mobile_number VARCHAR(20) NOT NULL,
occupation VARCHAR(100),
employment_status VARCHAR(15) NOT NULL CHECK (employment_status IN ('EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'STUDENT', 'RETIRED')),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = CURRENT_TIMESTAMP;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_updated_at
BEFORE UPDATE ON personal
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TABLE address(
id BIGINT NOT NULL PRIMARY KEY,
personal_id BIGINT NOT NULl, CONSTRAINT fk_peronal_id FOREIGN KEY (personal_id) REFERENCES personal(id),
address_type VARCHAR(12) NOT NULL CHECK (address_type IN ('RESIDENTIAL', 'POSTAL')), CONSTRAINT uq_pid_atype UNIQUE (personal_id, address_type),
address_line_1 VARCHAR(100) NOT NULL,
address_line_2 VARCHAR(100),
suburb VARCHAR(60),
city VARCHAR(60) NOT NULL,
district VARCHAR(60),
postal_code VARCHAR(10),
country VARCHAR(60) NOT NULL,
residential_status VARCHAR(20) CHECK (residential_status IN('OWNER', 'RENTING', 'FAMILY', 'OTHER')),
CONSTRAINT check_rstatus CHECK (address_type <> 'RESIDENTIAL' or residential_status IS NOT NULL),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_ad TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER address_updated_at
BEFORE UPDATE ON address
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TABLE personal_onboarding(
id BIGINT NOT NULL PRIMARY KEY,
personal_id BIGINT NOT NULL, CONSTRAINT fk_personal_id FOREIGN KEY (personal_id) REFERENCES personal(id), CONSTRAINT uq_pid UNIQUE (personal_id),
status VARCHAR(12) NOT NULL CHECK (status IN('DRAFT', 'SUBMITTED')) DEFAULT 'SUBMITTED',
current_step SMALLINT NOT NULL CHECK (current_step IN(1,2,3)) DEFAULT 1,
submitted_at TIMESTAMP,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL
);

CREATE TRIGGER ponboarding_updated_at
BEFORE UPDATE ON personal_onboarding
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE FUNCTION set_submitted_at()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.status = 'SUBMITTED' AND OLD.status <> 'SUMBITTED' 
	THEN NEW.submitted_at = CURRENT_TIMESTAMP;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_submitted_at
BEFORE UPDATE ON personal_onboarding
FOR EACH ROW
EXECUTE FUNCTION set_submitted_at();