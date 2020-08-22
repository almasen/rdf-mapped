-- tables

-- Table: capability
CREATE TABLE capability
(
    id SERIAL NOT NULL,
    title VARCHAR(64) NOT NULL,
    CONSTRAINT capability_pk PRIMARY KEY (id)
);

-- Table: category
CREATE TABLE category
(
    id SERIAL NOT NULL,
    title VARCHAR(64) NOT NULL,
    capability_id INT NOT NULL,
    CONSTRAINT category_pk PRIMARY KEY (id)
);

-- Table: competency
CREATE TABLE competency
(
    id SERIAL NOT NULL,
    title VARCHAR(64) NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT competency_pk PRIMARY KEY (id)
);

-- Table: phase
CREATE TABLE phase
(
    id SERIAL NOT NULL,
    title VARCHAR(64) NOT NULL,
    CONSTRAINT phase_pk PRIMARY KEY (id)
);

-- Table: course
CREATE TABLE course
(
    id SERIAL NOT NULL,
    title VARCHAR(128) NOT NULL,
    hyperlink VARCHAR(256) NOT NULL,
    urn VARCHAR(64) DEFAULT 'null' NOT NULL,
    capability_id INT NOT NULL,
    category_id INT NOT NULL,
    competency_id INT NOT NULL,
    CONSTRAINT course_pk PRIMARY KEY (id)
);

-- Table: level
CREATE TABLE video
(
    id SERIAL NOT NULL,
    title VARCHAR(128) NOT NULL,
    hyperlink VARCHAR(256) NOT NULL,
    urn VARCHAR(64) DEFAULT 'null' NOT NULL,
    capability_id INT NOT NULL,
    category_id INT NOT NULL,
    competency_id INT NOT NULL,
    CONSTRAINT video_pk PRIMARY KEY (id)
);

-- Table: course_phase
CREATE TABLE course_phase
(
    course_id INT NOT NULL,
    phase_id INT NOT NULL,
    -- CONSTRAINT course_phase_pk PRIMARY KEY (course_id)
    -- a couse can only have more than one phase/level
    CONSTRAINT course_phase_pk PRIMARY KEY (course_id,phase_id)
);

-- Table: video_phase
CREATE TABLE video_phase
(
    video_id INT NOT NULL,
    phase_id INT NOT NULL,
    CONSTRAINT video_phase_pk PRIMARY KEY (video_id,phase_id)
);

-- Table: information
CREATE TABLE information
(
    type VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    CONSTRAINT information_pk PRIMARY KEY (type)
);

-- Table: faq
CREATE TABLE faq
(
    id SERIAL NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    CONSTRAINT faq_pk PRIMARY KEY (id)
);

-- Table: learning_object
CREATE TABLE learning_object
(
    urn VARCHAR(64) NOT NULL,
    timestamp timestamptz NOT NULL,
    data jsonb,
    CONSTRAINT learning_object_pk PRIMARY KEY (urn)
);

-- Table: submission
CREATE TABLE submission
(
    id VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'processing',
    submitter VARCHAR(32) DEFAULT 'anonymous',
    data jsonb,
    CONSTRAINT submission_pk PRIMARY KEY (id)
);

-- Table: admin
CREATE TABLE admin
(
    id SERIAL NOT NULL,
    email VARCHAR(64) NOT NULL,
    username VARCHAR(64) NOT NULL,
    password_hash VARCHAR(64) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    CONSTRAINT admin_pk PRIMARY KEY (id)
);

-- END OF FILE
