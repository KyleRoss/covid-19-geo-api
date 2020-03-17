const Joi = require('@hapi/joi');
const countries = require('i18n-iso-countries');
const states = require('us-states-normalize/jsons/states.json');
const territories = require('us-states-normalize/jsons/territories.json');
const countryCodes = Object.keys(countries.getAlpha2Codes());

let abbrs = [
  ...Object.keys(states),
  ...Object.keys(territories)
];

const orderFields = [
  'country',
  'country_code',
  'province',
  'province_abbr',
  'lat',
  'long',
  'active',
  'confirmed',
  'recovered',
  'deaths',
  'mortality_rate',
  'recovery_rate',
  'last_update'
];

module.exports = Joi.object({
  country: Joi.string().uppercase().valid(...countryCodes).length(2),
  state: Joi.string().uppercase().length(2).valid(...abbrs).when('country', {
    not: Joi.valid('US'),
    then: Joi.forbidden().messages({
      'any.unknown': 'Country must be excluded or set to "US" when providing "state"'
    })
  }),
  order: Joi.string().lowercase().valid(...orderFields).default('active'),
  dir: Joi.string().uppercase().valid('ASC', 'DESC').default('DESC')
});
