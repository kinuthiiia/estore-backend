import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const OrderSchema = new Schema(
  {
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        salePrice: Number,
        quantity: Number,
      },
    ],
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    deliveryLocation: {
      lat: Number,
      lng: Number,
    },
    payment: {
      code: String,
      timestamp: String,
      name: String,
      amount: Number,
    },
    deliveryTimestamp: String,
    dispatchTimestamp: String,
    pickUpTimestamp: String,
  },
  {
    collection: "orders",
  }
);

OrderSchema.plugin(timestamps);

OrderSchema.index({ createdAt: 1, updatedAt: 1 });

export const Order = mongoose.model("Order", OrderSchema);
