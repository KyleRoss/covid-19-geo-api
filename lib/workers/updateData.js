const axios = require('axios');
const countries = require('i18n-iso-countries');
const states = require('us-states-normalize');
const db = require('../db');

const API_URL = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/1/query?where=1%3D1&outFields=*&f=pjson';

(async function() {
  try {
    const { data: covid } = await axios.get(API_URL);
    
    for(const { attributes: attr } of covid.features) {
      let country = attr.Country_Region;
      let province = attr.Province_State;
      let provinceAbbr = null;
      
      switch (country) {
        case 'US':
          country = 'United States of America'; break;
        case 'The Bahamas':
          country = 'Bahamas'; break;
        case 'North Macedonia':
          country = 'North Macedonia, Republic of'; break;
        case 'Tanzania':
          country = 'Tanzania, United Republic of'; break;
        case 'Taiwan*':
          country = 'Taiwan'; break;
        case 'Korea, South':
          country = 'South Korea'; break;
        case 'Holy See':
          country = 'Holy See (Vatican City State)'; break;
        case 'Moldova':
          country = 'Moldova, Republic of'; break;
        case 'Brunei':
          country = 'Brunei Darussalam'; break;
        case 'Iran':
          country = 'Iran, Islamic Republic of'; break;
        case 'Czechia':
          country = 'Czech Republic'; break;
        case 'Republic of the Congo':
          country = 'Congo, the Democratic Republic of the'; break;
        case 'Russia':
          country = 'Russian Federation'; break;
        case 'Eswatini':
          country = 'Swaziland'; break;
        case 'Congo (Kinshasa)':
          country = 'Congo';
          province = 'Kinshasa';
          break;
        case 'Congo (Brazzaville)':
          country = 'Congo';
          province = 'Brazzaville';
          break;
      }
      
      if(province && attr.Country_Region === 'US') {
        provinceAbbr = states(province, { region: ['state', 'territory'] });
      }
      
      await db.query(`
        INSERT INTO covid_data(id, country, country_code, province, province_abbr, lat, long, confirmed, recovered, deaths, last_update)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE
        SET
          country=EXCLUDED.country,
          country_code=EXCLUDED.country_code,
          province=EXCLUDED.province,
          province_abbr=EXCLUDED.province_abbr,
          lat=EXCLUDED.lat,
          long=EXCLUDED.long,
          confirmed=EXCLUDED.confirmed,
          recovered=EXCLUDED.recovered,
          deaths=EXCLUDED.deaths,
          last_update=EXCLUDED.last_update
      `, [
        attr.OBJECTID,
        country,
        countries.getAlpha2Code(country, 'en'),
        attr.Province_State,
        provinceAbbr,
        attr.Lat,
        attr.Long_,
        attr.Confirmed,
        attr.Recovered,
        attr.Deaths,
        new Date(attr.Last_Update)
      ]);
    }
    
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}());
