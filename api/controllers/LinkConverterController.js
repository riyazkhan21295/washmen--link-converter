/**
 * LinkConverterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const URL_TYPE_CONSTANTS = {
  WEB_URL: 'WEB_URL',
};

const isUrlWeb = (url) => {
  return url.startsWith('http');
};

const getUrlType = (url) => {
  if (isUrlWeb(url)) {
    return URL_TYPE_CONSTANTS.WEB_URL;
  }

  return null;
};

const validateUrl = ({ url, urlType }) => {
  const type = getUrlType(url);

  return type === urlType;
};

const convertWebUrlToDeeplink = (url) => {
  const deeplinkSearchParams = {
    Page: 'Home'
  };

  const urlObj = new URL(url);

  const pathnameSegments = urlObj.pathname.split('/');

  if (pathnameSegments[1] === 'sr') {
    deeplinkSearchParams.Page = 'Search';

    if (urlObj.searchParams.has('q')) {
      deeplinkSearchParams.Query = urlObj.searchParams.get('q');
    }
  }

  return `washmen://?${(new URLSearchParams(deeplinkSearchParams)).toString()}`;
};

module.exports = {
  webUrlToDeeplink: (request, response) => {
    const { url } = request.body;

    try {
      const isValidUrl = validateUrl({ url, urlType: URL_TYPE_CONSTANTS.WEB_URL });

      if (!isValidUrl) {
        return response.badRequest('Invalid URL');
      }

      const convertedUrl = convertWebUrlToDeeplink(url);

      return response.json(convertedUrl);
    } catch (error) {
      console.log('error :: ', error);

      return response.serverError('An error occurred');
    }
  },
};
