// src/pages/CreatePayment.jsx
import PaymentForm from '../components/Payment/PaymentForm';

const CreatePayment = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Payment</h2>
      <PaymentForm />
    </div>
  );
};

export default CreatePayment;