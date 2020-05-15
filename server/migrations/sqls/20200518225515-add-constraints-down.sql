-- -- foreign keys
ALTER TABLE category
    DROP CONSTRAINT category_capability;

ALTER TABLE competency
    DROP CONSTRAINT competency_category;

ALTER TABLE course
    DROP CONSTRAINT course_capability;

ALTER TABLE course
    DROP CONSTRAINT course_category;

ALTER TABLE course
    DROP CONSTRAINT course_competency;

ALTER TABLE video
    DROP CONSTRAINT video_capability;

ALTER TABLE video
    DROP CONSTRAINT video_category;

ALTER TABLE video
    DROP CONSTRAINT video_competency;
