import { Admin, Order, Product } from "./models/index.js";

import dotenv from "dotenv";
dotenv.config();

function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach(function (prop) {
    delete result[prop];
  });
  return result;
}

const resolvers = {
  Order: {
    items: async (parent, args) => {
      let _items = [];

      let orderItems = parent?.items;

      for (let item of orderItems) {
        let _populated = {
          product: await Product.findById(item?.product),
          quantity: item?.quantity,
          variant: item?.variant,
          salePrice: item?.salePrice,
        };

        _items.push(_populated);
      }

      return _items;
    },
  },

  Query: {
    getProducts: async () => {
      const products = await Product.find();
      return products;
    },

    getAdmins: async () => {
      let admins = await Admin.find({ removed: false });
      return admins;
    },

    getProduct: async (_, { id }) => {
      let product = await Product.findById(id);
      return product;
    },

    getOrders: async () => {
      const orders = await Order.find();
      return orders;
    },

    getAdmin: async (_, args) => {
      const { id, email, password } = args;

      let admin;

      if (id) {
        admin = await Admin.findById(id);
        return admin;
      }

      admin = await Admin.findOne({ email, password, removed: false });
      return admin;
    },
  },

  Mutation: {
    addProduct: async (_, args) => {
      const { name, variants, additionalInformation, images } = args;

      let variantsJS = JSON.parse(variants);
      let additionalInformationJS = JSON.parse(additionalInformation);

      let newProduct = new Product({
        name,
        variants: variantsJS,
        additionalInformation: additionalInformationJS,
        images,
      });

      let product = newProduct.save();
      return product;
    },

    updateProduct: async (_, args) => {
      const { name, variants, additionalInformation, id } = args;

      let variantsJS = JSON.parse(variants);
      let additionalInformationJS = JSON.parse(additionalInformation);

      let product = await Product.findByIdAndUpdate(id, {
        name,
        variants: variantsJS,
        additionalInformation: additionalInformationJS,
      });
      return product;
    },

    createAdmin: async (_, args) => {
      let { name, email, levelClearance } = args;

      let newAdmin = new Admin({
        name,
        email,
        levelClearance,
        password: "grapevine",
      });

      let admin = newAdmin.save();
      return admin;
    },

    addToCart: async (_, args) => {
      const { admin, product, variant } = args;

      let _order = await Order.findOneAndUpdate(
        {
          createdBy: admin,
          status: "open",
        },
        {
          $addToSet: { items: { product, quantity: 1, variant } },
        },
        {
          new: true,
          upsert: true,
        }
      );

      return _order;
    },

    updateCart: async (_, args) => {
      const { id, removal, quantity, admin } = args;

      let order;

      if (removal) {
        order = await Order.findOneAndUpdate(
          { createdBy: admin, status: "open" },
          { $pull: { items: { _id: id } } }
        );
      } else {
        order = await Order.findOne({ createdBy: admin, status: "open" })
          .then((doc) => {
            const index = doc?.items.findIndex((object) => {
              return object._id == id;
            });
            let x = doc?.items[index];
            x.quantity = quantity;
            doc.save();
            return doc;
          })
          .catch((err) => {
            console.log("Oh! Dark");
          });
      }

      return order;
    },

    checkout: async (_, args) => {
      const { id, customer, payment, delivery } = args;

      let customerJS = JSON.parse(customer);
      let paymentJS = JSON.parse(payment);
      let deliveryJS = JSON.parse(delivery);

      let order = await Order.findByIdAndUpdate(id, {
        status: "closed",
        customer: customerJS,
        payment: paymentJS,
        delivery: deliveryJS,
      });

      return order;
    },

    deliver: async (_, args) => {
      const { id } = args;

      let order = await Order.findById(id)
        .then((doc) => {
          doc.delivery.deliveryTimestamp = Date.now().toString();
          doc.delivery.deliveryStatus = "delivered";
          doc.save();
          return doc;
        })
        .catch((err) => {
          console.log("Oh! Dark");
        });

      return order;
    },

    updateAdmin: async (_, args) => {
      let admin = await Admin.findByIdAndUpdate(args?.id, omit(args, ["id"]));
      return admin;
    },
  },
};

export default resolvers;
