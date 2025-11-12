import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validatePaymentForm } from '../../utils/validation';
import { CreditCard } from 'lucide-react';

const PaymentForm = ({ initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState(initialData || {
    cardNumber: '',
    cardholderName: '',
    expirationDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Format expiration date as MM/YY
    if (name === 'expirationDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
    }

    // Limit CVV to 4 digits
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Read from form elements to support automated testing
    // where fill() may not trigger React's onChange properly
    const form = e.target;
    const currentFormData = {
      cardNumber: form.cardNumber.value || formData.cardNumber,
      cardholderName: form.cardholderName.value || formData.cardholderName,
      expirationDate: form.expirationDate.value || formData.expirationDate,
      cvv: form.cvv.value || formData.cvv
    };

    const validationErrors = validatePaymentForm(currentFormData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(currentFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Payment Information</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Test Mode:</strong> This is a demo. Use any test card number like 4532 1234 5678 9010
        </p>
      </div>

      <Input
        label="Card Number *"
        id="cardNumber"
        name="cardNumber"
        value={formData.cardNumber}
        onChange={handleChange}
        error={errors.cardNumber}
        placeholder="1234 5678 9012 3456"
        maxLength="19"
      />

      <Input
        label="Cardholder Name *"
        id="cardholderName"
        name="cardholderName"
        value={formData.cardholderName}
        onChange={handleChange}
        error={errors.cardholderName}
        placeholder="John Doe"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expiration Date *"
          id="expirationDate"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          error={errors.expirationDate}
          placeholder="MM/YY"
          maxLength="5"
        />

        <Input
          label="CVV *"
          id="cvv"
          name="cvv"
          type="password"
          value={formData.cvv}
          onChange={handleChange}
          error={errors.cvv}
          placeholder="123"
          maxLength="4"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
        <CreditCard className="w-5 h-5 text-gray-600 mt-0.5" />
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Your payment is secure</p>
          <p>All transactions are encrypted and secure. We never store your card details.</p>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue to Review
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
