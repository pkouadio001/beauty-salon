-- Ensure we are inserting into the correct schema
SET search_path TO hairstyle, public;

-- Insert services if they don't already exist
INSERT INTO services (name, description, price, category, duration, image)
VALUES
    ('Twisted braids', 'Standard professional haircut and styling', 45.00, 'Hairstyles', '30 minutes', 'images/hair3.jpg'),
    ('Picked to Perfection', 'Standard professional haircut and styling', 30.00, 'Hairstyles', '30 minutes', 'images/hair1.jpg'),
    ('Fluffed', 'Standard professional haircut and styling', 45.00, 'Hairstyles', '30 minutes', 'images/hair2.jpg'),
    ('Chrome hot pink nails', 'Standard professional haircut and styling', 45.00, 'Nails', '30 minutes', 'images/nail.png'),
    ('Flower pressing', ' Flower design of good quality', 50.00, 'Nails', '45 minutes', 'images/nail2.png'),
    ('Accented French Tips', 'French manicure with a perfect touch', 75.00, 'Nails', '50 minutes', 'images/nail3.png'),
    ('Swedish Massage', 'A light to medium pressure massage aimed at easing tension, improving blood flow, and promoting overall wellbeing', 100.00, 'Massage', '30 minutes', 'images/massage.png'),
    ('Hot Stone Massage', ' Gentie warmth helps muscles relax and improves circulation - perfect for stress relief and deep relaxation', 150.00, 'Massage', '65 minutes', 'images/massage2.png'),
    ('Sports Massage', 'Medium to deep pressure targeting specific muscle groups- ideal for active individuals or those recovering from training.', 75.00, 'Massage', '60 minutes', 'images/massage3.png')


ON CONFLICT DO NOTHING;

INSERT INTO customers (date_of_birth, email, first_name, last_name, password, phone_number)
VALUES ('03/10/2000', 'k@gmail.com', 'Kevin', 'Harris', '$2a$10$eVpjV5ecHyDKpn4NK129reCKLNM7vibC0p.gKNvSXAAavarvupiSy', '07777777777 '),
       ('05/07/1998', 'p@gmail.com', 'Paul', 'Doe', '$2a$10$eVpjV5ecHyDKpn4NK129reCKLNM7vibC0p.gKNvSXAAavarvupiSy', '07777778888'),
       ('05/11/1999', 'e@gmail.com', 'Emily', 'Smith', '$2a$10$eVpjV5ecHyDKpn4NK129reCKLNM7vibC0p.gKNvSXAAavarvupiSy', '07777779999')

ON CONFLICT DO NOTHING;

INSERT INTO employees (first_name, last_name, email, phone_number, specialization, bio, profile_image_url, is_active, created_at, date_of_birth, password, title)
VALUES ('Jessica', 'Perez', 'j@gmail.com', '07777777777', 'Hairdresser', 'I am a hairdresser', 'images/hairdresser.jpg', true, '2022-01-01', '01/01/2000', '$2a$10$eVpjV5ecHyDKpn4NK129reCKLNM7vibC0p.gKNvSXAAavarvupiSy', 'EMPLOYEE'),
       ('Fernandez', 'Calderon', 'f@gmail.com', '07777778888', 'Nail Artist', 'I am a nail artist', 'images/nailartist.jpg', true, '2022-01-01', '01/01/2000', '$2a$10$eVpjV5ecHyDKpn4NK129reCKLNM7vibC0p.gKNvSXAAavarvupiSy', 'EMPLOYEE'),
       ('Carolina', 'Trinidad', 'c@gmail.com', '07777779999', 'Massage Therapist', 'I am a massage therapist', 'images/massage.jpg', true, '2022-01-01', '01/01/2000', '$2a$10$eVpjV5ecHyDKpn4NK129reCKLNM7vibC0p.gKNvSXAAavarvupiSy', 'ADMIN')
ON CONFLICT DO NOTHING;

INSERT INTO appointments (appointment_date, appointment_time, service_id, status, total_price, employee_id, customer_id)
VALUES
    -- Appointment 1: A completed haircut
    ('2026-05-10', '10:30:00', 1, 'COMPLETED', 45.00, 1, 1),

    -- Appointment 2: A pending manicure for next week
    ('2026-05-15', '14:00:00', 2, 'PENDING', 30.00, 2, 2),

    -- Appointment 3: A cancelled beard trim
    ('2026-05-12', '09:15:00', 3, 'CANCELLED', 20.00, 1, 3);