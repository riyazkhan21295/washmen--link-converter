/**
 * LinkConverter.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    requestType: {
      type: 'string',
      required: true
    },
    requestUrl: {
      type: 'string',
      required: true
    },
    responseType: {
      type: 'string',
      required: true
    },
    responseUrl: {
      type: 'string',
      required: true
    }
  },
};

