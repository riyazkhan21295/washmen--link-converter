/**
 * LinkConverterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  webUrlToDeeplink: (request, response) => {
    const { url } = request.body;

    return response.json(url);
  },
};
