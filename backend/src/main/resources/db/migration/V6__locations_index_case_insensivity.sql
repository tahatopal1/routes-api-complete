ALTER TABLE locations
    MODIFY COLUMN location_name VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    MODIFY COLUMN location_code VARCHAR(10)  COLLATE utf8mb4_unicode_ci NOT NULL,
    MODIFY COLUMN country       VARCHAR(60)  COLLATE utf8mb4_unicode_ci NOT NULL,
    MODIFY COLUMN city          VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL;

CREATE INDEX idx_locations_name ON locations(location_name);
CREATE INDEX idx_locations_code ON locations(location_code);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_country ON locations(country);