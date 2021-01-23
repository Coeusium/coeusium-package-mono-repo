DROP TRIGGER IF EXISTS noSelfParentInsertTrigger;
CREATE Trigger noSelfParentInsertTrigger BEFORE Insert ON auth_group
    FOR EACH ROW
    BEGIN
        IF(new.group_name = new.group_parent) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'group_name and group_parent cannot be the same'
        END IF;
    END;
