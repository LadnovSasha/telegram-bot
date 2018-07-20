const requestPromise = require('request-promise');

const apiReq = requestPromise.defaults({
  baseUrl: process.env.API_URL,
});

async function request(options) {
  try {
    const resp = await apiReq(options);
    return JSON.parse(resp);
  } catch(err) {
    return err;
  }
}
module.exports = {
  getCategories() {
    return request('/categories');
  },
  getBodystyles(category) {
    return request(`/categories/${category}/bodystyles`);
  },
  getBrands(category) {
    return request(`/categories/${category}/brands`);
  },
  getModels(category, brands) {
    const requests = brands.map(brandId => request(`/categories/${category}/brands/${brandId}/models`))
    return Promise.all(requests).then(values => {
      return [].concat(...values);
    });
  }
}
