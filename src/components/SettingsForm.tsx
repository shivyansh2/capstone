import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './SettingsForm.module.css';

// Zod schema for validation
const settingsSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  notificationPreferences: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export interface SettingsFormProps {
  onSubmit?: (data: SettingsFormData) => void | Promise<void>;
  initialValues?: Partial<SettingsFormData>;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    mode: 'onBlur',
    defaultValues: initialValues || {
      fullName: '',
      email: '',
      notificationPreferences: false,
    },
  });

  const handleFormSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={styles.form}
      noValidate
    >
      <div className={styles.formGroup}>
        <label htmlFor="fullName" className={styles.label}>
          Full Name
          <span className={styles.required}>*</span>
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          {...register('fullName')}
        />
        {errors.fullName && (
          <span id="fullName-error" className={styles.error}>
            {errors.fullName.message}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
          <span className={styles.required}>*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email address"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <span id="email-error" className={styles.error}>
            {errors.email.message}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <div className={styles.checkboxContainer}>
          <input
            id="notificationPreferences"
            type="checkbox"
            className={styles.checkbox}
            aria-describedby="notificationPreferences-help"
            {...register('notificationPreferences')}
          />
          <label htmlFor="notificationPreferences" className={styles.checkboxLabel}>
            Enable notification preferences
          </label>
        </div>
        <span id="notificationPreferences-help" className={styles.help}>
          Receive updates and notifications about your account
        </span>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
        <button
          type="button"
          className={styles.resetButton}
          onClick={() => reset()}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;
