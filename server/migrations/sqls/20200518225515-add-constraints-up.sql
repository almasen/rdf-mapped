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

-- -- Reference: complaint_user (table: complaint)
-- ALTER TABLE complaint ADD CONSTRAINT complaint_user
--     FOREIGN KEY (user_id)
--         REFERENCES "user" (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: event_address (table: event)
-- ALTER TABLE event ADD CONSTRAINT event_address
--     FOREIGN KEY (address_id)
--         REFERENCES address (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: event_user (table: event)
-- ALTER TABLE event ADD CONSTRAINT event_user
--     FOREIGN KEY (user_id)
--         REFERENCES "user" (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: event_picture (table: event)
-- ALTER TABLE event ADD CONSTRAINT event_picture
--     FOREIGN KEY (picture_id)
--         REFERENCES picture (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: eventcause_cause (table: event_cause)
-- ALTER TABLE event_cause ADD CONSTRAINT eventcause_cause
--     FOREIGN KEY (cause_id)
--         REFERENCES cause (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: eventcause_event (table: event_cause)
-- ALTER TABLE event_cause ADD CONSTRAINT eventcause_event
--     FOREIGN KEY (event_id)
--         REFERENCES event (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: favourite_event (table: favourite)
-- ALTER TABLE favourite ADD CONSTRAINT favourite_event
--     FOREIGN KEY (event_id)
--         REFERENCES event (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: favourite_individual (table: favourite)
-- ALTER TABLE favourite ADD CONSTRAINT favourite_individual
--     FOREIGN KEY (individual_id)
--         REFERENCES individual (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: individual_address (table: individual)
-- ALTER TABLE individual ADD CONSTRAINT individual_address
--     FOREIGN KEY (address_id)
--         REFERENCES address (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: individual_picture (table: individual)
-- ALTER TABLE individual ADD CONSTRAINT individual_picture
--     FOREIGN KEY (picture_id)
--         REFERENCES picture (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: individual_user (table: individual)
-- ALTER TABLE individual ADD CONSTRAINT individual_user
--     FOREIGN KEY (user_id)
--         REFERENCES "user" (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: notification_user_receiver (table: notification)
-- ALTER TABLE notification ADD CONSTRAINT notification_user_receiver
--     FOREIGN KEY (receiver_id)
--         REFERENCES "user" (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: notification_user_sender (table: notification)
-- ALTER TABLE notification ADD CONSTRAINT notification_user_sender
--     FOREIGN KEY (sender_id)
--         REFERENCES "user" (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: organisation_address (table: organisation)
-- ALTER TABLE organisation ADD CONSTRAINT organisation_address
--     FOREIGN KEY (address_id)
--         REFERENCES address (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: organisation_picture (table: organisation)
-- ALTER TABLE organisation ADD CONSTRAINT organisation_picture
--     FOREIGN KEY (picture_id)
--         REFERENCES picture (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: organisation_user (table: organisation)
-- ALTER TABLE organisation ADD CONSTRAINT organisation_user
--     FOREIGN KEY (user_id)
--         REFERENCES "user" (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: profile_individual (table: profile)
-- ALTER TABLE profile ADD CONSTRAINT profile_individual
--     FOREIGN KEY (individual_id)
--         REFERENCES individual (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: report_user_reported (table: report_user)
-- ALTER TABLE report_user ADD CONSTRAINT report_user_reported
--     FOREIGN KEY (user_reporting)
--         REFERENCES "user" (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: report_user_reporting (table: report_user)
-- ALTER TABLE report_user ADD CONSTRAINT report_user_reporting
--     FOREIGN KEY (user_reported)
--         REFERENCES "user" (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: reset_user (table: reset)
-- ALTER TABLE reset ADD CONSTRAINT reset_user
--     FOREIGN KEY (user_id)
--         REFERENCES "user" (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: selectedcause_cause (table: selected_cause)
-- ALTER TABLE selected_cause ADD CONSTRAINT selectedcause_cause
--     FOREIGN KEY (cause_id)
--         REFERENCES cause (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: selectedcause_user (table: selected_cause)
-- ALTER TABLE selected_cause ADD CONSTRAINT selectedcause_user
--     FOREIGN KEY (user_id)
--         REFERENCES "user" (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: signup_event (table: sign_up)
-- ALTER TABLE sign_up ADD CONSTRAINT signup_event
--     FOREIGN KEY (event_id)
--         REFERENCES event (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: signup_individual (table: sign_up)
-- ALTER TABLE sign_up ADD CONSTRAINT signup_individual
--     FOREIGN KEY (individual_id)
--         REFERENCES individual (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: user_registration (table: user)
-- ALTER TABLE "user" ADD CONSTRAINT user_registration
--     FOREIGN KEY (email)
--         REFERENCES registration (email)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- Reference: user_settings (table: setting)
-- ALTER TABLE setting ADD CONSTRAINT user_settings
--     FOREIGN KEY (user_id)
--         REFERENCES "user" (id)
-- NOT DEFERRABLE
--             INITIALLY IMMEDIATE
-- ;

-- -- End of file.
