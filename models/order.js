import mongoose from "mongoose";
import timestamps from "mongoose-timestamp";

const { Schema } = mongoose;

export const OrderSchema = new Schema(
  {
    status: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        salePrice: Number,
        quantity: Number,
        variant: String,
      },
    ],
    customer: {
      name: String,
      phoneNumber: String,
    },
    delivery: {
      toBeDelivered: Boolean,
      deliveryStatus: String,
      deliveryTimestamp: String,
      location: String,
      amount: Number,
    },
    payment: {
      mode: String,
      code: String,
    },
  },
  {
    collection: "orders",
  }
);

OrderSchema.plugin(timestamps);

OrderSchema.index({ createdAt: 1, updatedAt: 1 });

export const Order = mongoose.model("Order", OrderSchema);
