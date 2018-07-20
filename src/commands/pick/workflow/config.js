const api = require('../../../api');

const config = {
  category: {
    id: 'category_id',
    title: 'Please select a category',
    api: api.getCategories,
  },
  bodystyles: {
    id: 'bodystyles',
    title: 'Please select a bodystyles',
    api: api.getBodystyles,
    apiArgs: ['category_id'],
    multiSelect: true,
  },
  brands: {
    id: 'marka_id',
    title: 'Please select brand',
    api: api.getBrands,
    apiArgs: ['category_id'],
    multiSelect: true,
  },
  models: {
    id: 'model_id',
    title: 'Please select model',
    api: api.getModels,
    apiArgs: ['category_id', 'marka_id'],
  },
}
module.exports = {
  get(flow) {
    return config[flow];
  }
}
