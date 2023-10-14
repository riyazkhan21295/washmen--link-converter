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
  [URL_TYPE.WEB]: 'https://www.washmen.com',
  [URL_TYPE.DEEPLINK]: 'washmen://'
};

const PAGE_TYPE = {
  HOME: 'Home',
  PRODUCT: 'Product',
  SEARCH: 'Search'
};

const isUrlWeb = (url) => {
  return url.startsWith('http');
};

const isUrlDeeplink = (url) => {
  return url.startsWith(BASE_URL.DEEPLINK);
};

const getUrlType = (url) => {
  if (isUrlWeb(url)) {
    return URL_TYPE.WEB;
  }

  if (isUrlDeeplink(url)) {
    return URL_TYPE.DEEPLINK;
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
    Page: PAGE_TYPE.HOME
  };

  if (service === 'sr') {
    deeplinkSearchParams.Page = PAGE_TYPE.SEARCH;

    if (urlObj.searchParams.has('q')) {
      deeplinkSearchParams.Query = urlObj.searchParams.get('q');
    }
  }

  const isValidProduct = (new RegExp(/^(.*?)-p-(\d+)$/)).test(product);
  if (isValidProduct) {
    const [, productId] = product.split('-p-');

    deeplinkSearchParams.Page = PAGE_TYPE.PRODUCT;
    deeplinkSearchParams.ContentId = productId;

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

  if (page === PAGE_TYPE.SEARCH) {
    return `${BASE_URL.WEB}/sr?q=${params.Query}`;
  }

  if (page === PAGE_TYPE.PRODUCT) {
    const contentId = params.get('ContentId');

    const query = [
            params.has('CityId') ? `cityId=${params.get('CityId')}` : '',
            params.has('ClusterId') ? `clusterId=${params.get('ClusterId')}` : ''
    ].filter(q => q);

    const serviceName = 'serviceName'; // Todo

    const productName = 'productName'; // Todo

    return `${BASE_URL.WEB}/${serviceName}/${productName}-p-${contentId}?${query.join('&')}`;
  }

  return BASE_URL.WEB;
};

module.exports = {
  webUrlToDeeplink: (request, response) => {
    const { url } = request.body;

    try {
      const isValidUrl = validateUrl({ url, urlType: URL_TYPE.WEB });

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
      const isValidUrl = validateUrl({ url, urlType: URL_TYPE.DEEPLINK });

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
