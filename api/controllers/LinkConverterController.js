/**
 * LinkConverterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const URL_TYPE_CONSTANTS = {
  WEB_URL: 'WEB_URL',
  DEEPLINK: 'DEEPLINK'
};

const isUrlWeb = (url) => {
  return url.startsWith('http');
};

const isUrlDeeplink = (url) => {
  return url.startsWith('washmen://');
};

const getUrlType = (url) => {
  if (isUrlWeb(url)) {
    return URL_TYPE_CONSTANTS.WEB_URL;
  }

  if (isUrlDeeplink(url)) {
    return URL_TYPE_CONSTANTS.DEEPLINK;
  }

  return null;
};

const validateUrl = ({ url, urlType }) => {
  const type = getUrlType(url);

  return type === urlType;
};

const convertWebUrlToDeeplink = (url) => {
  const urlObj = new URL(url);

  const [, service, product] = urlObj.pathname.split('/');

  const deeplinkSearchParams = {
    Page: 'Home'
  };

  if (service === 'sr') {
    deeplinkSearchParams.Page = 'Search';

    if (urlObj.searchParams.has('q')) {
      deeplinkSearchParams.Query = urlObj.searchParams.get('q');
    }
  }

  const isValidProduct = (new RegExp(/^(.*?)-p-(\d+)$/)).test(product);
  if (isValidProduct) {
    const [, productId] = product.split('-p-');

    deeplinkSearchParams.Page = 'Product';
    deeplinkSearchParams.ContentId = productId;

    if (urlObj.searchParams.has('cityId')) {
      deeplinkSearchParams.CityId = urlObj.searchParams.get('cityId');
    }

    if (urlObj.searchParams.has('clusterId')) {
      deeplinkSearchParams.ClusterId = urlObj.searchParams.get('clusterId');
    }
  }

  return `washmen://?${(new URLSearchParams(deeplinkSearchParams)).toString()}`;
};

const convertDeeplinkToWebUrl = (url) => {
  return url;
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

  deeplinkToWebUrl: (request, response) => {
    const { url } = request.body;

    try {
      const isValidUrl = validateUrl({ url, urlType: URL_TYPE_CONSTANTS.WEB_URL });

      if (!isValidUrl) {
        return response.badRequest('Invalid URL');
      }

      const convertedUrl = convertDeeplinkToWebUrl(url);

      return response.json(convertedUrl);
    } catch (error) {
      console.log('error :: ', error);

      return response.serverError('An error occurred');
    }
  }
};
