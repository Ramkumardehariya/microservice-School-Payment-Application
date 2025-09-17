const axios = require('axios');
const jwt = require('jsonwebtoken');

class PaymentService {
  constructor() {
    this.apiKey = process.env.RAZORPAY_KEY;
    this.pgKey = process.env.RAZORPAY_SECRET;
    this.baseURL = process.env.RAZORPAY_BASE_URL;
  }

  // Generate JWT token for payment API
  generatePaymentJWT(payload) {
    return jwt.sign(payload, this.pgKey, { algorithm: 'HS256' });
  }

  // Create collect request
  async createCollectRequest(orderData) {
    try {
      const jwtPayload = {
        amount: orderData.orderAmount,
        orderId: orderData.customOrderId,
        customerId: orderData.student.id,
        customerEmail: orderData.student.email,
        customerPhone: orderData.student.phone || '',
        description: `Payment for ${orderData.student.name}`,
        callbackUrl: `${process.env.APP_URL}/webhook`
      };

      const auth = Buffer.from(`${this.apiKey}:${this.pgKey}`).toString("base64");

      const response = await axios.post(
        `${this.baseURL}/orders`,
        {
          amount: orderData.orderAmount * 100, // Razorpay expects amount in paise
          currency: "INR",
          receipt: orderData.customOrderId,
          notes: {
            schoolId: orderData.schoolId,
            studentName: orderData.student.name
          }
        },
        {
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json"
          }
        }
      );


      return response.data;
    } catch (error) {
      console.error('Payment API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Payment request failed');
    }
  }
}

module.exports = new PaymentService();