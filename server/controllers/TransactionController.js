const mongoose = require('mongoose');
const Order = require('../models/order');
const OrderStatus = require('../models/orderStatus');

// Get all transactions with aggregation
exports.getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    // Aggregation pipeline to join Order and OrderStatus
    const pipeline = [
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collectId',
          as: 'status_info'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$gatewayName',
          order_amount: '$status_info.orderAmount',
          transaction_amount: '$status_info.transactionAmount',
          status: '$status_info.status',
          custom_order_id: 1,
          payment_time: '$status_info.paymentTime',
          createdAt: 1
        }
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    ];

    const transactions = await Order.aggregate(pipeline);
    const total = await Order.countDocuments();

    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: {
        transactions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get transactions by school
exports.getTransactionsBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { schoolId: new mongoose.Types.ObjectId(schoolId) } },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collectId',
          as: 'status_info'
        }
      },
      { $unwind: '$status_info' },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$gatewayName',
          order_amount: '$status_info.orderAmount',
          transaction_amount: '$status_info.transactionAmount',
          status: '$status_info.status',
          custom_order_id: 1,
          payment_time: '$status_info.paymentTime'
        }
      },
      { $skip: skip },
      { $limit: limit }
    ];


    const transactions = await Order.aggregate(pipeline);
    const total = await Order.countDocuments({ schoolId: schoolId });

    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: {
        transactions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: "Something went wrong",
      errors: error.message
    });
  }
};

// Check transaction status
exports.checkTransactionStatus = async (req, res) => {
  try {
    const { customOrderId } = req.params;
    console.log("customOrderId:", customOrderId);

    // Find the order by customOrderId
    const order = await Order.findOne({ customOrderId });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }

    // Manually find related OrderStatus
    const orderStatus = await OrderStatus.findOne({ collectId: order._id });

    if (!orderStatus) {
      return res.status(404).json({
        status: 'error',
        message: 'Order status not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        order_id: order.customOrderId,
        status: orderStatus.status,
        transaction_amount: orderStatus.transactionAmount,
        payment_mode: orderStatus.paymentMode,
        payment_time: orderStatus.paymentTime
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};