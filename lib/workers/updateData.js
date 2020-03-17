const axios = require('axios');
const countries = require('i18n-iso-countries');
const states = require('us-states-normalize');
const db = require('../db');

const API_URL = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/1/query?where=1%3D1&outFields=*&f=pjson';

class UpdateData {
  /**
   * Entrypoint
   */
  async run() {
    const data = await this._callApi();
    
    for(const { attributes: attr } of data) {
      const record = this._formatRecord(attr);
      await this._insertRecord(record);
    }
  }
  
  /**
   * Call the ArcGIS API to get the latest COVID-19 data
   * @returns {Promise<Object[]>} Array of data objects
   */
  async _callApi() {
    const { data } = await axios.get(API_URL);
    return data.features;
  }
  
  /**
   * Formats a single record handling custom features and data issues
   * @param {Object} rec Raw record from ArcGIS
   * @returns {Object} Formatted data object
   */
  _formatRecord(rec) {
    const data = {
      id: rec.OBJECTID,
      country: rec.Country_Region.replace(/\*$/, ''),
      country_code: null,
      province: rec.Province_State,
      province_abbr: null,
      lat: rec.Lat,
      long: rec.Long_,
      active: rec.Confirmed - (rec.Recovered + rec.Deaths),
      confirmed: rec.Confirmed,
      recovered: rec.Recovered,
      deaths: rec.Deaths,
      mortality_rate: ((rec.Deaths / rec.Confirmed) * 100).toFixed(2),
      recovery_rate: ((rec.Recovered / rec.Confirmed) * 100).toFixed(2),
      last_update: new Date(rec.Last_Update)
    };
    
    let properCountry = null;
    
    // Handle data issues
    switch (data.country) {
      case 'US':
        data.country = 'United States of America'; break;
      case 'The Bahamas':
        data.country = 'Bahamas'; break;
      case 'North Macedonia':
        properCountry = 'North Macedonia, Republic of'; break;
      case 'Tanzania':
        properCountry = 'Tanzania, United Republic of'; break;
      case 'Korea, South':
        data.country = 'South Korea'; break;
      case 'Holy See':
        properCountry = 'Holy See (Vatican City State)'; break;
      case 'Moldova':
        properCountry = 'Moldova, Republic of'; break;
      case 'Brunei':
        data.country = 'Brunei Darussalam'; break;
      case 'Iran':
        properCountry = 'Iran, Islamic Republic of'; break;
      case 'Czechia':
        data.country = 'Czech Republic'; break;
      case 'Republic of the Congo':
        properCountry = 'Congo, the Democratic Republic of the'; break;
      case 'Russia':
        data.country = 'Russian Federation'; break;
      case 'Eswatini':
        data.country = 'Swaziland'; break;
      case 'Congo (Kinshasa)':
        data.country = 'Congo';
        data.province = 'Kinshasa';
        break;
      case 'Congo (Brazzaville)':
        data.country = 'Congo';
        data.province = 'Brazzaville';
        break;
    }
    
    // set country code
    data.country_code = countries.getAlpha2Code(properCountry || data.country, 'en') || null;
    
    // set state abbreviation for US
    if(data.province && rec.Country_Region === 'US') {
      data.province_abbr = states(data.province, { region: ['state', 'territory'] });
    }
    
    return data;
  }
  
  /**
   * Inserts a formatted record into the database
   * @param {Object} data Formatted record to insert
   * @returns {Promise<Object>} Result from pg
   */
  _insertRecord(data) {
    const cols = Object.keys(data);
    
    return db.raw(`
        INSERT INTO covid_data(${cols.join(', ')})
        VALUES (${cols.map(col => `:${col}`).join(', ')})
        ON CONFLICT (id) DO UPDATE
        SET
          ${cols.filter(col => col !== 'id').map(col => `${col}=EXCLUDED.${col}`).join(', ')}
      `, data);
  }
}

(async function() {
  const updateData = new UpdateData();
  
  try {
    await updateData.run();
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}());
