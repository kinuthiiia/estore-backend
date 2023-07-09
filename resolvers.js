import { Admin, User, Order, Product, Section } from "./models/index.js";
import cloudinary from "cloudinary";

function getUnique(value, index, array) {
  return self.indexOf(value) === index;
}

function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach(function (prop) {
    delete result[prop];
  });
  return result;
}

cloudinary.v2.config({
  cloud_name: "dxjhcfinq",
  api_key: "292858742431259",
  api_secret: "os1QzAVfEfifsaRgMvsXEfXlPws",
});

const resolvers = {
  User: {
    cart: async (parent, args) => {
      let _cart = [];

      let cartItems = parent?.cart;

      for (let item of cartItems) {
        let _populated = {
          product: await Product.findById(item?.product),
          quantity: item?.quantity,
          variant: item?.variant,
          id: item?.id,
        };

        _cart.push(_populated);
      }

      return _cart;
    },
  },

  Query: {
    getProducts: async () => {
      const products = await Product.find();
      return products;
    },

    getAdmins: async () => {
      let admins = await Admin.find();
      return admins;
    },

    getProduct: async (_, { id }) => {
      let product = await Product.findById(id);
      return product;
    },

    getUser: async (_, { email }) => {
      let user = await User.findOne({ email }).populate("saved");
      return user;
    },
  },

  Mutation: {
    addProduct: async (_, args) => {
      const {
        name,
        description,
        category,
        variants,
        additionalInformation,
        images,
      } = args;

      let variantsJS = JSON.parse(variants);
      let additionalInformationJS = JSON.parse(additionalInformation);

      let _images = [];
      let _variants = [];

      for (let image of images) {
        let { url } = await cloudinary.v2.uploader.upload(image, {
          public_id: "",
          folder: "products",
        });
        _images.push(url);
      }

      for (let _variant of variantsJS) {
        if (_variant?.thumbnail) {
          let { url } = await cloudinary.v2.uploader.upload(
            _variant?.thumbnail,
            {
              public_id: "",
              folder: "thumbnails",
            }
          );
          let variant = {
            thumbnail: url,
            label: _variant?.label,
            price: _variant?.price,
          };
          _variants?.push(variant);
        } else {
          let variant = {
            thumbnail: null,
            label: _variant?.label,
            price: _variant?.price,
          };
          _variants?.push(variant);
        }
      }

      let newProduct = new Product({
        name,
        description,
        category,
        variants: _variants,
        additionalInformation: additionalInformationJS,
        images: _images,
      });

      let product = newProduct.save();
      return product;
    },

    createAdmin: async (_, args) => {
      let { name, email, levelClearance } = args;

      let newAdmin = new Admin({
        name,
        email,
        levelClearance,
        password: "thrift",
      });

      let admin = newAdmin.save();
      return admin;
    },

    addToCart: async (_, args) => {
      const { customer, product, variant } = args;

      let _customer = await User.findOneAndUpdate(
        {
          email: customer,
        },
        {
          $addToSet: { cart: { product, quantity: 1, variant } },
        }
      );

      return _customer;
    },

    updateCart: async (_, args) => {
      const { id, removal, quantity, email } = args;

      let user;

      if (removal) {
        user = await User.findOneAndUpdate(
          { email },
          { $pull: { cart: { _id: id } } }
        );
      } else {
        user = await User.findOne({ email })
          .then((doc) => {
            const index = doc?.cart.findIndex((object) => {
              return object._id == id;
            });
            let x = doc?.cart[index];
            x.quantity = quantity;
            doc.save();
            return doc;
          })
          .catch((err) => {
            console.log("Oh! Dark");
          });
      }

      return user;
    },

    saveUnsave: async (_, args) => {
      const { product, customer } = args;

      let doc = await User.findOne({ email: customer });

      let items = doc.saved;
      const index = items.indexOf(product);

      let newSaved;

      if (index > -1) {
        items.splice(index, 1);
        newSaved = items;
      } else {
        newSaved = [...items, product];
      }

      let newDoc = await User.findOneAndUpdate(
        { email: customer },
        {
          saved: newSaved,
        }
      );
      return newDoc;
    },

    updateProfile: async (_, args) => {
      const { name, email, phoneNumber } = args;

      let user = await User.findOneAndUpdate({ email }, { name, phoneNumber });
      return user;
    },

    addAddress: async (_, args) => {
      const { label, lat, lng, email } = args;

      let user = await User.findOneAndUpdate(
        { email },
        {
          $addToSet: {
            addresses: {
              label,
              lat,
              lng,
              default: false,
            },
          },
        }
      );

      return user;
    },

    mutateAddress: async (_, args) => {
      const { email, action, id, default: _default } = args;

      let user;

      if (action == "toggle-default") {
        user = await User.findOne({ email })
          .then((doc) => {
            const index = doc?.addresses.findIndex((object) => {
              return object._id == id;
            });
            let x = doc?.addresses[index];
            x.default = _default;
            doc.save();
            return doc;
          })
          .catch((err) => {
            console.log("Oh! Dark");
          });
      }

      if (action == "remove") {
        user = await User.findOneAndUpdate(
          { email, "address.id": id },
          {
            $pull: {
              addresses: {
                _id: id,
              },
            },
          }
        );
      }

      return user;
    },
  },
};

export default resolvers;
