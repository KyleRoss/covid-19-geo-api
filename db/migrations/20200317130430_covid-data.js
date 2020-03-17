exports.up = async db => {
  await db.schema.createTable('covid_data', t => {
    t.integer('id').primary().notNullable();
    t.string('country', 50).notNullable();
    t.specificType('country_code', 'CHAR(2)').index();
    t.string('province', 50);
    t.specificType('province_abbr', 'CHAR(2)').index();
    t.float('lat').notNullable();
    t.float('long').notNullable();
    t.integer('active').notNullable().defaultTo(0);
    t.integer('confirmed').notNullable().defaultTo(0);
    t.integer('recovered').notNullable().defaultTo(0);
    t.integer('deaths').notNullable().defaultTo(0);
    t.specificType('mortality_rate', 'NUMERIC(5,2)').notNullable().defaultTo(0);
    t.specificType('recovery_rate', 'NUMERIC(5,2)').notNullable().defaultTo(0);
    t.timestamp('last_update').notNullable();
  });
  
  await db.schema.raw(`
  CREATE OR REPLACE VIEW all_data AS
    SELECT
      country,
      country_code,
      province,
      province_abbr,
      lat,
      long,
      active,
      confirmed,
      recovered,
      deaths,
      mortality_rate::FLOAT,
      recovery_rate::FLOAT,
      last_update
    FROM covid_data;
  `);
  
  await db.schema.raw(`
  CREATE OR REPLACE VIEW totals AS
    SELECT
      (SUM(confirmed) - (SUM(recovered) + SUM(deaths)))::INTEGER AS total_active,
      SUM(confirmed)::INTEGER AS total_confirmed,
      SUM(recovered)::INTEGER AS total_recovered,
      SUM(deaths)::INTEGER AS total_deaths,
      trunc((SUM(deaths)::DECIMAL / SUM(confirmed)::DECIMAL) * 100, 2)::FLOAT AS mortality_rate,
      trunc((SUM(recovered)::DECIMAL / SUM(confirmed)::DECIMAL) * 100, 2)::FLOAT AS recovery_rate
    FROM covid_data;
  `);
  
  await db.schema.raw(`
  CREATE OR REPLACE VIEW country_totals AS
    SELECT
      country,
      country_code,
      (SUM(confirmed) - (SUM(recovered) + SUM(deaths)))::INTEGER AS total_active,
      SUM(confirmed)::INTEGER AS total_confirmed,
      SUM(recovered)::INTEGER AS total_recovered,
      SUM(deaths)::INTEGER AS total_deaths,
      trunc((SUM(deaths)::DECIMAL / SUM(confirmed)::DECIMAL) * 100, 2)::FLOAT AS mortality_rate,
      trunc((SUM(recovered)::DECIMAL / SUM(confirmed)::DECIMAL) * 100, 2)::FLOAT AS recovery_rate
    FROM covid_data
    GROUP BY country_code, country;
  `);
};

exports.down = async db => {
  await db.schema.raw('DROP VIEW IF EXISTS all_data;');
  await db.schema.raw('DROP VIEW IF EXISTS totals;');
  await db.schema.raw('DROP VIEW IF EXISTS country_totals;');
  await db.schema.dropTableIfExists('covid_data');
};
