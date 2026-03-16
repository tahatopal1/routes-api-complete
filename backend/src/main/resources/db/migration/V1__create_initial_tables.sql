CREATE TABLE locations
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    location_code VARCHAR(10)  NOT NULL UNIQUE,
    country       VARCHAR(60)  NOT NULL,
    city          VARCHAR(100) NOT NULL,
    location_type ENUM ('AIRPORT', 'VENUE') DEFAULT 'AIRPORT'
);

CREATE TABLE transportations
(
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    origin              INT NOT NULL,
    destination         INT NOT NULL,
    transportation_type ENUM ('FLIGHT', 'BUS', 'SUBWAY', 'UBER') DEFAULT 'FLIGHT',


    CONSTRAINT fk_transportation_origin_location
        FOREIGN KEY (origin)
            REFERENCES locations (id),

    CONSTRAINT fk_transportation_destination_location
        FOREIGN KEY (destination)
            REFERENCES locations (id),

    CONSTRAINT uk_transportation_od
        UNIQUE (origin, destination, transportation_type)
);

CREATE TABLE transportation_op_days
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    day               INT NOT NULL,
    transportation_id INT NOT NULL,

    CONSTRAINT fk_transportation_op_day_transportation
        FOREIGN KEY (transportation_id)
            REFERENCES transportations (id)
)


