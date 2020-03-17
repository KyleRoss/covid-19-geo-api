CREATE TABLE IF NOT EXISTS covid_data (
  id INTEGER NOT NULL,
  country VARCHAR(50) NOT NULL,
  country_code CHAR(2),
  province VARCHAR(50),
  province_abbr CHAR(2),
  lat FLOAT NOT NULL,
  long FLOAT NOT NULL,
  confirmed INTEGER NOT NULL DEFAULT 0,
  recovered INTEGER NOT NULL DEFAULT 0,
  deaths INTEGER NOT NULL DEFAULT 0,
  last_update TIMESTAMP,
  CONSTRAINT covid_data_pkey PRIMARY KEY (id)
);

CREATE INDEX covid_data_country_code_idx ON covid_data(country_code);
CREATE INDEX covid_data_province_abbr_idx ON covid_data(province_abbr);
