const Order = require("../models/order");
const OrderStatus = require("../models/orderStatus");
const PaymentService = require("../Services/paymentService");

exports.createPayment = async(req, res) => {
    try {
        const {schoolId, trusteeId, student, gatewayName, orderAmount} = req.body;

        if(!schoolId || !trusteeId || !student || !gatewayName || !orderAmount){
            return res.status(400).json({
                success: false,
                message: "All fields are mendatory",
            })
        }

        const order = await Order.create({
            schoolId,
            trusteeId,
            student,
            gatewayName,
            orderAmount
        })

        await OrderStatus.create({
            collectId: order._id,
            orderAmount,
            transactionAmount: 0,
            paymentMode: '',
            status: 'pending'
        });

        const paymentResponse = await PaymentService.createCollectRequest(order);

        res.status(200).json({
            success: true,
            message: 'Payment initiated successfully',
            data: {
                order: order,
                paymentUrl: paymentResponse.payment_url
            }
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}