'use strict';

const transformProductInfo = product => ({
  id: product.id,
  productId: product.productId,
  product: product.product.title,
  portionWeight: product.portionWeight,
  components: [],
});

/**
 * Transform Meal entity with eager dependencies for response accordingly with applied filters
 *
 * @param meal
 * @param withProducts
 * @param withComponents
 * @return {{id: *, date: *, title: *, products: Array, components: any[]}}
 */
const transformForResponse = (meal, { withProducts, withComponents }) => {
  let products = [];
  let componentsInfo = {};

  if (withProducts) {
    products = meal.mealProducts.map(transformProductInfo);
  }

  if (withComponents) {
    // get products info and food components info
    products = meal.mealProducts.map(mealProduct => {
      const { portionWeight } = mealProduct;
      const { portionCount } = mealProduct.product;

      // calculate components ratio in product
      const components = mealProduct.product.productComponents.map(productComponent => {
        const id = productComponent.componentId;
        const title = productComponent.foodComponent.title;
        const total = (portionWeight / portionCount) * productComponent.componentValue;

        // calculate total sum of components
        if (!componentsInfo[id]) {
          componentsInfo[id] = {
            id,
            title,
            total: 0,
          };
        }
        componentsInfo[id].total += total;

        return {
          id,
          title,
          total,
        };
      });

      return {
        ...transformProductInfo(mealProduct),
        components,
      };
    });
  }

  return {
    id: meal.id,
    date: meal.date,
    title: meal.title,
    products,
    components: Object.values(componentsInfo),
  };
};

module.exports = {
  transformForResponse,
};
