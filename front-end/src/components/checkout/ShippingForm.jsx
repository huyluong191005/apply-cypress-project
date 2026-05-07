import { useState } from 'react';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import { validateShippingForm } from '../../utils/validation';

const ShippingForm = ({ initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [errors, setErrors] = useState({});
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateShippingForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData, sameAsBilling);
  };

  return (
    <form data-cy="shipping-form" onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          data-cy="shipping-name"
          label="Full Name *"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <Input
          data-cy="shipping-email"
          label="Email *"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
      </div>

      <Input
        data-cy="shipping-phone"
        label="Phone Number *"
        id="phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
      />

      <Input
        data-cy="shipping-address"
        label="Street Address *"
        id="address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
      />

      <Input
        data-cy="shipping-apartment"
        label="Apartment, Suite, etc. (Optional)"
        id="apartment"
        name="apartment"
        value={formData.apartment}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          data-cy="shipping-city"
          label="City *"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
        />

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <select
            data-cy="shipping-state"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`input-field ${errors.state ? 'border-red-500' : ''}`}
          >
            <option value="">Select State</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
            <option value="IL">Illinois</option>
            <option value="PA">Pennsylvania</option>
            <option value="OH">Ohio</option>
            <option value="GA">Georgia</option>
            <option value="NC">North Carolina</option>
            <option value="MI">Michigan</option>
          </select>
          {errors.state && (
            <p data-cy="validation-error" className="mt-1 text-sm text-red-600">{errors.state}</p>
          )}
        </div>

        <Input
          data-cy="shipping-zip"
          label="ZIP Code *"
          id="zipCode"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          error={errors.zipCode}
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country *
        </label>
        <select
          data-cy="shipping-country"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="input-field"
        >
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="Mexico">Mexico</option>
        </select>
      </div>

      <Checkbox
        data-cy="same-as-billing"
        id="sameAsBilling"
        label="Billing address is same as shipping address"
        checked={sameAsBilling}
        onChange={(e) => setSameAsBilling(e.target.checked)}
      />

      <div className="flex gap-4 pt-4">
        {onBack && (
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
        )}
        <Button data-cy="continue-to-payment" type="submit" className="flex-1">
          Continue to Payment
        </Button>
      </div>
    </form>
  );
};

export default ShippingForm;
