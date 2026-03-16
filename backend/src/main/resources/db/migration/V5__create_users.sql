CREATE TABLE users
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    email    VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role     VARCHAR(10) DEFAULT 'ADMIN'
);

INSERT INTO users(email, password, role)
VALUES ('admin@route.com', '$2a$12$LJoHq8VKnND3JGPk41IHSOBBAQU30kkxhDDOaJg1Bc2EggTUEmB4C', 'ADMIN'),
 ('agency@route.com', '$2a$12$U3rRKv2mYePadKDA3fVU2uVQ9HNxaOtFKWKx.etOlGzfvNkz/XHAq', 'AGENCY')
