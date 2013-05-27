
-- create table
DROP TABLE IF EXISTS activity CASCADE;

CREATE TABLE activity
(
  id serial NOT NULL,
  user_id integer NOT NULL,
  "content" text,
  create_time date,
  happen_time date,
  place text,
  status integer,
  CONSTRAINT activity_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE activity OWNER TO postgres;
GRANT ALL ON TABLE activity TO postgres;
GRANT ALL ON TABLE activity TO public;

-- create table
DROP TABLE IF EXISTS enrollment CASCADE;

CREATE TABLE enrollment
(
  id serial NOT NULL,
  user_id integer NOT NULL,
  activity_id integer NOT NULL,
  CONSTRAINT enrollment_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE enrollment OWNER TO postgres;
GRANT ALL ON TABLE enrollment TO postgres;
GRANT ALL ON TABLE enrollment TO public;

-- create table
DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user"
(
  id serial NOT NULL,
  "name" character varying(255) NOT NULL,
  "password" character varying(255),
  CONSTRAINT user_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "user" OWNER TO postgres;
GRANT ALL ON TABLE "user" TO postgres;
GRANT ALL ON TABLE "user" TO public;