import React, { useState } from 'react';

interface FormData {
  fullName: string;
  email: string;
  notificationPreferences: boolean;
}

export const SettingsForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    notificationPreferences: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Settings saved: ' + JSON.stringify(formData));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your name"
        />
        {errors.fullName && <span style={{ color: 'red' }}>{errors.fullName}</span>}
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="notificationPreferences"
            checked={formData.notificationPreferences}
            onChange={handleChange}
          />
          Enable notifications
        </label>
      </div>

      <button type="submit">Save</button>
    </form>
  );
};
