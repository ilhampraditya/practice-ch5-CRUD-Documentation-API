 CREATE TABLE students(
    id bigserial primary key,
    name varchar(255) not null,
    age integer not null,
    address varchar(255) not null,
   is_active Boolean not null default false
);