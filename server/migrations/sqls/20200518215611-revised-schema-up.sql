-- tables

-- Table: capability
CREATE TABLE capability
(
    id serial NOT NULL,
    title varchar(64) NOT NULL,
    CONSTRAINT capability_pk PRIMARY KEY (id)
);

-- Table: category
CREATE TABLE category
(
    id serial NOT NULL,
    title varchar(64) NOT NULL,
    capability_id int NOT NULL,
    CONSTRAINT category_pk PRIMARY KEY (id)
);

-- Table: competency
CREATE TABLE competency
(
    id serial NOT NULL,
    title varchar(64) NOT NULL,
    category_id int NOT NULL,
    CONSTRAINT competency_pk PRIMARY KEY (id)
);

-- Table: phase
CREATE TABLE phase
(
    id serial NOT NULL,
    title varchar(64) NOT NULL,
    CONSTRAINT phase_pk PRIMARY KEY (id)
);

-- Table: course
CREATE TABLE course
(
    id serial NOT NULL,
    title varchar(128) NOT NULL,
    hyperlink varchar(256) NOT NULL,
    urn varchar(64) DEFAULT 'null' NOT NULL,
    capability_id int NOT NULL,
    category_id int NOT NULL,
    competency_id int NOT NULL,
    CONSTRAINT course_pk PRIMARY KEY (id)
);

-- Table: level
CREATE TABLE video
(
    id serial NOT NULL,
    title varchar(128) NOT NULL,
    hyperlink varchar(256) NOT NULL,
    urn varchar(64) DEFAULT 'null' NOT NULL,
    capability_id int NOT NULL,
    category_id int NOT NULL,
    competency_id int NOT NULL,
    CONSTRAINT video_pk PRIMARY KEY (id)
);

-- Table: course_phase
CREATE TABLE course_phase
(
    course_id int NOT NULL,
    phase_id int NOT NULL,
    -- CONSTRAINT course_phase_pk PRIMARY KEY (course_id)
    -- a couse can only have more than one phase/level
    CONSTRAINT course_phase_pk PRIMARY KEY (course_id,phase_id)
);

-- Table: video_phase
CREATE TABLE video_phase
(
    video_id int NOT NULL,
    phase_id int NOT NULL,
    CONSTRAINT video_phase_pk PRIMARY KEY (video_id,phase_id)
);

-- Table: information
CREATE TABLE information
(
    type varchar(64) NOT NULL,
    content text NOT NULL,
    CONSTRAINT information_pk PRIMARY KEY (type)
);

-- Table: faq
CREATE TABLE faq
(
    id serial NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    CONSTRAINT faq_pk PRIMARY KEY (id)
);

-- Table: submission
CREATE TABLE submission
(
    id varchar(64) NOT NULL,
    status varchar(32) NOT NULL,
    submitter varchar(32) DEFAULT 'anonymous',
    authentication_status INT DEFAULT 0 NOT NULL,
    data jsonb,
    CONSTRAINT submission_pk PRIMARY KEY (id)
);


-- END OF FILE
