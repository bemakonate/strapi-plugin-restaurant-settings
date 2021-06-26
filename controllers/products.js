const pluginId = require("../admin/src/pluginId");
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    getProducts: async (ctx) => {
        const plugin = strapi.plugins[pluginId];

        //Get all products from plugin. Make sure we don't expose sensitive information
        const entity = await strapi.query("product", pluginId).find();
        const sanitizedProducts = sanitizeEntity(entity, { model: plugin.models.product });

        //Loop through each product and populate each product
        const populatedProducts = await Promise.all(sanitizedProducts.map(async (product) => {
            const newProduct = await plugin.services.populate.populatedSanitizedProduct({ id: product.id });
            return newProduct;
        }))
        return populatedProducts

    },
    getProduct: async (ctx) => {
        const { id } = ctx.params;
        const plugin = strapi.plugins[pluginId];

        //---------convert into middleware-------
        //If the product doesn't exist in the database return an error
        const entity = await strapi.query("product", pluginId).findOne({ id });
        if (!entity) {
            // return ctx.throw(400, "The product doesn't exist")
            return new Error("The product doesn't exist")
        }
        //-------------------------

        const product = await plugin.services.populate.populatedSanitizedProduct({ id });
        return product
    },


}