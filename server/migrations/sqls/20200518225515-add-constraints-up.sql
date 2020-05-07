-- -- foreign keys

-- Reference: category_capability (table: category)
ALTER TABLE category ADD CONSTRAINT category_capability
    FOREIGN KEY (capability_id)
        REFERENCES capability (id)
NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: competency_category (table: competency)
ALTER TABLE competency ADD CONSTRAINT competency_category
    FOREIGN KEY (category_id)
        REFERENCES category (id)
NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: course_capability (table: course)
ALTER TABLE course ADD CONSTRAINT course_capability
    FOREIGN KEY (capability_id)
        REFERENCES capability (id)
NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: course_category (table: course)
ALTER TABLE course ADD CONSTRAINT course_category
    FOREIGN KEY (category_id)
        REFERENCES category (id)
NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: course_competency (table: course)
ALTER TABLE course ADD CONSTRAINT course_competency
    FOREIGN KEY (competency_id)
        REFERENCES competency (id)
NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: video_capability (table: video)
ALTER TABLE video ADD CONSTRAINT video_capability
    FOREIGN KEY (capability_id)
        REFERENCES capability (id)
NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: video_category (table: video)
ALTER TABLE video ADD CONSTRAINT video_category
    FOREIGN KEY (category_id)
        REFERENCES category (id)
NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- Reference: video_competency (table: video)
ALTER TABLE video ADD CONSTRAINT video_competency
    FOREIGN KEY (competency_id)
        REFERENCES competency (id)
NOT DEFERRABLE
            INITIALLY IMMEDIATE
;

-- -- End of file.
