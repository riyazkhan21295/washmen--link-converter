/**
 * LinkConverterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const URL_TYPE = {
  WEB: 'WEB',
  DEEPLINK: 'DEEPLINK'
};

const BASE_URL = {
  WEB: 'https://www.washmen.com',
  DEEPLINK: 'washmen://'
};

const PAGE = {
  HOME: 'Home',
  PRODUCT: 'Product',
  SEARCH: 'Search'
};

const isWebUrl = (url) => url.startsWith('http');

const isDeeplink = (url) => url.startsWith(BASE_URL.DEEPLINK);

const convertWebUrlToDeeplink = (url) => {
  const urlObj = new URL(url);

  const [, service, product = ''] = urlObj.pathname.split('/');

  const deeplinkSearchParams = {
    Page: PAGE.HOME
  };

  if (service === 'sr') {
    deeplinkSearchParams.Page = PAGE.SEARCH;

    if (urlObj.searchParams.has('q')) {
      deeplinkSearchParams.Query = urlObj.searchParams.get('q');
    }
  }

  const productMatch = product.match(/^(.*?)-p-(\d+)$/);
  if (productMatch) {
    deeplinkSearchParams.Page = PAGE.PRODUCT;
    deeplinkSearchParams.ContentId = productMatch[2];

    if (urlObj.searchParams.has('cityId')) {
      deeplinkSearchParams.CityId = urlObj.searchParams.get('cityId');
    }

    if (urlObj.searchParams.has('clusterId')) {
      deeplinkSearchParams.ClusterId = urlObj.searchParams.get('clusterId');
    }
  }

  return `${BASE_URL.DEEPLINK}?${(new URLSearchParams(deeplinkSearchParams)).toString()}`;
};

const convertDeeplinkToWebUrl = (url) => {
  const params = new URLSearchParams(url.replace(`${BASE_URL.DEEPLINK}?`, ''));

  const page = params.get('Page');

  if (page === PAGE.SEARCH) {
    return `${BASE_URL.WEB}/sr?q=${params.Query}`;
  }

  if (page === PAGE.PRODUCT) {
    const contentId = params.get('ContentId');

    const query = [
            params.has('CityId') ? `cityId=${params.get('CityId')}` : '',
            params.has('ClusterId') ? `clusterId=${params.get('ClusterId')}` : ''
    ].filter(q => q);

    const serviceName = 'serviceName'; // Todo: find service name from database
    const productName = 'productName'; // Todo: find product name from database

    return `${BASE_URL.WEB}/${serviceName}/${productName}-p-${contentId}?${query.join('&')}`;
  }

  return BASE_URL.WEB;
};

module.exports = {
  webUrlToDeeplink: async (request, response) => {
    const { webURL } = request.body;

    try {
      if (!isWebUrl(webURL)) {
        return response.badRequest('Invalid URL');
      }

      const convertedUrl = convertWebUrlToDeeplink(webURL);

      await LinkConverter.create({
        requestType: URL_TYPE.WEB,
        requestUrl: webURL,
        responseType: URL_TYPE.DEEPLINK,
        responseUrl: convertedUrl
      });

      return response.json({ deeplink: convertedUrl });
    } catch (error) {
      console.log('error :: ', error);

      return response.serverError('An error occurred');
    }
  },

  deeplinkToWebUrl: async (request, response) => {
    const { deeplink } = request.body;

    try {
      if (!isDeeplink(deeplink)) {
        return response.badRequest('Invalid URL');
      }

      const convertedUrl = convertDeeplinkToWebUrl(deeplink);

      await LinkConverter.create({
        requestType: URL_TYPE.DEEPLINK,
        requestUrl: deeplink,
        responseType: URL_TYPE.WEB,
        responseUrl: convertedUrl
      });

      return response.json({ webURL: convertedUrl });
    } catch (error) {
      console.log('error :: ', error);

      return response.serverError('An error occurred');
    }
  }
};
