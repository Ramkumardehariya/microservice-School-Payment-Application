const Order = require('../models/order');
const OrderStatus = require('../models/orderStatus');
const WebhookLog = require('../models/webhookLog');

exports.processWebhook = async (req, res) => {
  let webhookLog;
  try {
    // 1️⃣ Log the incoming webhook payload
    webhookLog = await WebhookLog.create({
      payload: req.body,
      status: req.body.status
    });

    const { order_info } = req.body;

    if (!order_info || !order_info.order_id) {
      await WebhookLog.findByIdAndUpdate(webhookLog._id, {
        processed: false,
        error: 'order_info.order_id is required'
      });

      return res.status(400).json({
        status: 'error',
        message: '"order_info.order_id" is required'
      });
    }

    // 2️⃣ Find order by customOrderId
    const order = await Order.findOne({ customOrderId: order_info.order_id });

    if (!order) {
      await WebhookLog.findByIdAndUpdate(webhookLog._id, {
        processed: false,
        error: 'Order not found'
      });

      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // 3️⃣ Update the order status document
    await OrderStatus.findOneAndUpdate(
      { collectId: order._id }, // ✅ corrected to match schema
      {
        orderAmount: order_info.order_amount,
        transactionAmount: order_info.transaction_amount,
        paymentMode: order_info.payment_mode,
        paymentDetails: order_info.payemnt_details, // spelling matches your payload
        bankReference: order_info.bank_reference,
        paymentMessage: order_info.Payment_message,
        status: order_info.status,
        errorMessage: order_info.error_message,
        paymentTime: new Date(order_info.payment_time)
      },
      { upsert: true, new: true }
    );

    // 4️⃣ Mark webhook log as processed
    await WebhookLog.findByIdAndUpdate(webhookLog._id, {
      processed: true
    });

    // 5️⃣ Respond to client
    res.status(200).json({
      status: 'success',
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    if (webhookLog && webhookLog._id) {
      await WebhookLog.findByIdAndUpdate(webhookLog._id, {
        processed: false,
        error: error.message
      });
    }

    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
