CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    affected_id INTEGER;
BEGIN
    IF TG_OP = 'DELETE' THEN
        affected_id := OLD.id;
    ELSE
        affected_id := NEW.id;
    END IF;

    INSERT INTO audit_log (
        action,
        entity,
        entity_id,
        details
    )
    VALUES (
        TG_OP,
        TG_TABLE_NAME,
        affected_id,
        TG_OP || ' on ' || TG_TABLE_NAME
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER audit_individual_equipment
AFTER INSERT OR UPDATE OR DELETE
ON individual_equipment
FOR EACH ROW
EXECUTE FUNCTION log_audit_event();


CREATE TRIGGER audit_equipment_type
AFTER INSERT OR UPDATE OR DELETE
ON equipment_type
FOR EACH ROW
EXECUTE FUNCTION log_audit_event();


CREATE TRIGGER audit_location
AFTER INSERT OR UPDATE OR DELETE
ON location
FOR EACH ROW
EXECUTE FUNCTION log_audit_event();


CREATE TRIGGER audit_borrow_request
AFTER INSERT OR UPDATE OR DELETE
ON borrow_request
FOR EACH ROW
EXECUTE FUNCTION log_audit_event();


CREATE TRIGGER audit_loan
AFTER INSERT OR UPDATE OR DELETE
ON loan
FOR EACH ROW
EXECUTE FUNCTION log_audit_event();


CREATE TRIGGER audit_renewal_request
AFTER INSERT OR UPDATE OR DELETE
ON renewal_request
FOR EACH ROW
EXECUTE FUNCTION log_audit_event();


CREATE TRIGGER audit_app_user
AFTER INSERT OR UPDATE OR DELETE
ON app_user
FOR EACH ROW
EXECUTE FUNCTION log_audit_event();