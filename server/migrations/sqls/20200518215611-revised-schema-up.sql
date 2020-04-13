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
    title varchar(64) NOT NULL,
    hyperlink varchar(256) NOT NULL,
    capability_id int NOT NULL,
    category_id int NOT NULL,
    competency_id int NOT NULL,
    CONSTRAINT course_pk PRIMARY KEY (id)
);

-- Table: level
CREATE TABLE video
(
    id serial NOT NULL,
    title varchar(64) NOT NULL,
    hyperlink varchar(256) NOT NULL,
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

-- -- Table: course_competency
-- CREATE TABLE course_competency
-- (
--     course_id int NOT NULL,
--     competency_id int NOT NULL,
--     CONSTRAINT course_competency_pk PRIMARY KEY (course_id)
-- );

-- -- Table: course_category
-- CREATE TABLE course_category
-- (
--     course_id int NOT NULL,
--     category_id int NOT NULL,
--     CONSTRAINT course_category_pk PRIMARY KEY (course_id)
-- );

-- -- Table: course_capability
-- CREATE TABLE course_capability
-- (
--     course_id int NOT NULL,
--     capabilty_id int NOT NULL,
--     CONSTRAINT course_capability_pk PRIMARY KEY (course_id)
-- );

-- -- Table: video_competency
-- CREATE TABLE video_competency
-- (
--     video_id int NOT NULL,
--     competency_id int NOT NULL,
--     CONSTRAINT video_competency_pk PRIMARY KEY (video_id)
-- );

-- -- Table: video_category
-- CREATE TABLE video_category
-- (
--     video_id int NOT NULL,
--     category_id int NOT NULL,
--     CONSTRAINT video_category_pk PRIMARY KEY (video_id)
-- );

-- -- Table: video_capability
-- CREATE TABLE video_capability
-- (
--     video_id int NOT NULL,
--     capabilty_id int NOT NULL,
--     CONSTRAINT video_capability_pk PRIMARY KEY (video_id)
-- );

-- -- Table: address
-- CREATE TABLE address
-- (
--     id serial NOT NULL,
--     address_1 varchar(64) NOT NULL,
--     address_2 varchar(64) NULL,
--     postcode varchar(64) NOT NULL,
--     city varchar(64) NOT NULL,
--     region varchar(64) NULL,
--     lat decimal(10,7) NOT NULL,
--     long decimal(10,7) NOT NULL,
--     CONSTRAINT address_pk PRIMARY KEY (id)
-- );

-- -- Table: authentication
-- CREATE TABLE authentication
-- (
--     id serial NOT NULL,
--     token varchar(256) NOT NULL,
--     creation_date timestamptz NOT NULL,
--     user_id int NOT NULL,
--     CONSTRAINT authentication_ak_1 UNIQUE (token)
--     NOT DEFERRABLE  INITIALLY IMMEDIATE,
--                                 CONSTRAINT authentication_pk PRIMARY KEY
--     (id)
-- );

--     -- Table: cause
--     CREATE TABLE cause
--     (
--         id serial NOT NULL,
--         name varchar(64) NOT NULL,
--         description varchar(512) NOT NULL,
--         title varchar(512) NOT NULL,
--         CONSTRAINT cause_pk PRIMARY KEY (id)
--     );

--     -- Table: complaint
--     CREATE TABLE complaint
--     (
--         id serial NOT NULL,
--         type varchar(64) NOT NULL,
--         message varchar(512) NOT NULL,
--         user_id int NOT NULL,
--         CONSTRAINT complaint_pk PRIMARY KEY (id)
--     );

--     -- Table: event
--     CREATE TABLE event
--     (
--         id serial NOT NULL,
--         name varchar(127) NOT NULL,
--         address_id int NOT NULL,
--         women_only boolean NOT NULL,
--         spots int NOT NULL,
--         address_visible boolean NOT NULL,
--         minimum_age int NOT NULL,
--         photo_id boolean NOT NULL,
--         physical boolean NOT NULL,
--         add_info boolean NOT NULL,
--         content text NOT NULL,
--         date timestamptz NOT NULL,
--         user_id int NOT NULL,
--         picture_id int,
--         creation_date timestamptz NOT NULL,
--         CONSTRAINT event_pk PRIMARY KEY (id)
--     );

--     -- Table: event_cause
--     CREATE TABLE event_cause
--     (
--         event_id int NOT NULL,
--         cause_id int NOT NULL,
--         CONSTRAINT event_cause_pk PRIMARY KEY (event_id,cause_id)
--     );

--     -- Table: favourite
--     CREATE TABLE favourite
--     (
--         individual_id int NOT NULL,
--         event_id int NOT NULL,
--         CONSTRAINT favourite_pk PRIMARY KEY (individual_id,event_id)
--     );

--     -- Table: individual
--     CREATE TABLE individual
--     (
--         id serial NOT NULL,
--         firstname varchar(64) NOT NULL,
--         lastname varchar(64) NOT NULL,
--         phone varchar(64) NOT NULL,
--         banned boolean NOT NULL,
--         user_id int NOT NULL,
--         picture_id int NULL,
--         address_id int NOT NULL,
--         birthday date NOT NULL,
--         gender char(1) NOT NULL,
--         CONSTRAINT individual_pk PRIMARY KEY (id)
--     );

--     -- Table: information
--     CREATE TABLE information
--     (
--         type varchar(64) NOT NULL,
--         content text NOT NULL,
--         CONSTRAINT information_pk PRIMARY KEY (type)
--     );

--     -- Table: notification
--     CREATE TABLE notification
--     (
--         id serial NOT NULL,
--         type varchar(64) NOT NULL,
--         message varchar(512) NOT NULL,
--         timestamp_sent timestamptz NOT NULL,
--         sender_id int NOT NULL,
--         receiver_id int NOT NULL,
--         CONSTRAINT notification_pk PRIMARY KEY (id)
--     );

--     -- Table: organisation
--     CREATE TABLE organisation
--     (
--         id serial NOT NULL,
--         org_name varchar(64) NOT NULL,
--         org_number varchar(64) NOT NULL,
--         org_type varchar(64) NOT NULL,
--         poc_firstname varchar(64) NOT NULL,
--         poc_lastname varchar(64) NOT NULL,
--         phone varchar(64) NOT NULL,
--         banned boolean NOT NULL,
--         org_register_date date NOT NULL,
--         low_income boolean NOT NULL,
--         exempt boolean NOT NULL,
--         picture_id int NULL,
--         user_id int NOT NULL,
--         address_id int NOT NULL,
--         bio text,
--         website varchar(256),
--         CONSTRAINT organisation_ak_1 UNIQUE (org_number)
--         NOT DEFERRABLE  INITIALLY IMMEDIATE,
--                               CONSTRAINT organisation_ak_2 UNIQUE
--         (org_name) NOT DEFERRABLE  INITIALLY IMMEDIATE,
--                               CONSTRAINT organisation_pk PRIMARY KEY
--         (id)
-- );

--         -- Table: picture
--         CREATE TABLE picture
--         (
--             id serial NOT NULL,
--             picture_location varchar(256) NOT NULL,
--             CONSTRAINT picture_pk PRIMARY KEY (id)
--         );

--         -- Table: profile
--         CREATE TABLE profile
--         (
--             id serial NOT NULL,
--             individual_id int NOT NULL,
--             karma_points int NOT NULL DEFAULT 0,
--             bio text NULL,
--             women_only boolean NOT NULL,
--             CONSTRAINT profile_pk PRIMARY KEY (id)
--         );

--         -- Table: registration
--         CREATE TABLE registration
--         (
--             email varchar(64) NOT NULL,
--             email_flag int NOT NULL,
--             id_flag int NOT NULL,
--             phone_flag int NOT NULL,
--             sign_up_flag int NOT NULL,
--             verification_token varchar(64) NOT NULL,
--             expiry_date timestamptz NOT NULL,
--             CONSTRAINT registration_pk PRIMARY KEY (email)
--         );

--         -- Table: report_user
--         CREATE TABLE report_user
--         (
--             id serial NOT NULL,
--             user_reported int NOT NULL,
--             type varchar(512) NOT NULL,
--             message varchar(512) NOT NULL,
--             user_reporting int NOT NULL,
--             CONSTRAINT report_user_pk PRIMARY KEY (id)
--         );

--         -- Table: reset
--         CREATE TABLE reset
--         (
--             id serial NOT NULL,
--             user_id int NOT NULL,
--             password_token varchar(64) NOT NULL,
--             expiry_date timestamptz NOT NULL,
--             CONSTRAINT reset_pk PRIMARY KEY (id)
--         );

--         -- Table: selected_cause
--         CREATE TABLE selected_cause
--         (
--             user_id int NOT NULL,
--             cause_id int NOT NULL,
--             CONSTRAINT selected_cause_pk PRIMARY KEY (user_id,cause_id)
--         );

--         -- Table: setting
--         CREATE TABLE setting
--         (
--             user_id int NOT NULL,
--             email int NOT NULL DEFAULT 0,
--             notifications int NOT NULL DEFAULT 0,
--             CONSTRAINT setting_pk PRIMARY KEY (user_id)
--         );

--         -- Table: sign_up
--         CREATE TABLE sign_up
--         (
--             individual_id int NOT NULL,
--             event_id int NOT NULL,
--             confirmed boolean DEFAULT NULL,
--             attended boolean NOT NULL DEFAULT FALSE,
--             CONSTRAINT sign_up_pk PRIMARY KEY (individual_id,event_id)
--         );

--         -- Table: user
--         CREATE TABLE "user"
--         (
--             id serial NOT NULL,
--             email varchar(64) NOT NULL,
--             username varchar(64) NOT NULL,
--             password_hash varchar(64) NOT NULL,
--             verified boolean NOT NULL,
--             salt varchar(64) NOT NULL,
--             date_registered timestamptz NOT NULL,
--                         CONSTRAINT user_ak_2 UNIQUE
--             (email) NOT DEFERRABLE  INITIALLY IMMEDIATE,
--                         CONSTRAINT user_pk PRIMARY KEY
--             (id)
-- );

-- -- END OF FILE
