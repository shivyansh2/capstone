import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsForm } from '../SettingsForm';

describe('SettingsForm', () => {
  describe('empty field validation', () => {
    it('should show "Name is required" error when submitting with empty full name', async () => {
      const user = userEvent.setup();
      render(<SettingsForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /save settings/i });

      // Fill email, leave name empty
      await user.type(emailInput, 'test@example.com');

      // Submit form
      await user.click(submitButton);

      // Check for error message
      await waitFor(() => {
        const errorMessage = screen.getByText('Name is required');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveAttribute('id', 'fullName-error');
      });
    });

    it('should show "Email is required" error when submitting with empty email', async () => {
      const user = userEvent.setup();
      render(<SettingsForm />);

      const fullNameInput = screen.getByLabelText(/full name/i);
      const submitButton = screen.getByRole('button', { name: /save settings/i });

      // Fill name, leave email empty
      await user.type(fullNameInput, 'John Doe');

      // Submit form
      await user.click(submitButton);

      // Check for error message
      await waitFor(() => {
        const errorMessage = screen.getByText('Email is required');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveAttribute('id', 'email-error');
      });
    });

    it('should show both errors when submitting empty form', async () => {
      const user = userEvent.setup();
      render(<SettingsForm />);

      const submitButton = screen.getByRole('button', { name: /save settings/i });

      // Submit form without filling any field
      await user.click(submitButton);

      // Check for both error messages
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });
  });

  describe('email validation', () => {
    it('should show "Invalid email format" error for invalid email', async () => {
      const user = userEvent.setup();
      render(<SettingsForm />);

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /save settings/i });

      // Fill form with invalid email
      await user.type(fullNameInput, 'John Doe');
      await user.type(emailInput, 'invalid-email');

      // Submit form
      await user.click(submitButton);

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });

    it('should accept valid email formats', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<SettingsForm onSubmit={mockOnSubmit} />);

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /save settings/i });

      // Fill form with valid data
      await user.type(fullNameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      // Submit form
      await user.click(submitButton);

      // Check that onSubmit was called
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          fullName: 'John Doe',
          email: 'john@example.com',
          notificationPreferences: false,
        });
      });
    });
  });

  describe('successful submit', () => {
    it('should call onSubmit with form data on successful submission', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<SettingsForm onSubmit={mockOnSubmit} />);

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const notificationCheckbox = screen.getByLabelText(/enable notification/i);
      const submitButton = screen.getByRole('button', { name: /save settings/i });

      // Fill form
      await user.type(fullNameInput, 'Jane Smith');
      await user.type(emailInput, 'jane@example.com');
      await user.click(notificationCheckbox);

      // Submit form
      await user.click(submitButton);

      // Check that onSubmit was called with correct data
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          notificationPreferences: true,
        });
      });
    });

    it('should disable submit button while submitting', async () => {
      const mockOnSubmit = jest.fn(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );
      const user = userEvent.setup();
      render(<SettingsForm onSubmit={mockOnSubmit} />);

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /save settings/i });

      // Fill form
      await user.type(fullNameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      // Click submit
      await user.click(submitButton);

      // Button should be disabled
      expect(submitButton).toBeDisabled();

      // Wait for submission to complete
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should not call onSubmit if onSubmit prop is not provided', async () => {
      const user = userEvent.setup();
      render(<SettingsForm />);

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /save settings/i });

      // Fill form
      await user.type(fullNameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      // Submit form - should not throw error
      await user.click(submitButton);

      // Wait for form state to update
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('reset functionality', () => {
    it('should clear form fields when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsForm />);

      const fullNameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const resetButton = screen.getByRole('button', { name: /reset/i });

      // Fill form
      await user.type(fullNameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      // Verify fields are filled
      expect(fullNameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('john@example.com');

      // Click reset
      await user.click(resetButton);

      // Fields should be cleared
      await waitFor(() => {
        expect(fullNameInput.value).toBe('');
        expect(emailInput.value).toBe('');
      });
    });
  });

  describe('keyboard navigation and accessibility', () => {
    it('should be fully keyboard navigable', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<SettingsForm onSubmit={mockOnSubmit} />);

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const notificationCheckbox = screen.getByLabelText(/enable notification/i);
      const submitButton = screen.getByRole('button', { name: /save settings/i });

      // Tab through fields
      await user.tab();
      expect(fullNameInput).toHaveFocus();

      await user.type(fullNameInput, 'John Doe');
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.type(emailInput, 'john@example.com');
      await user.tab();
      expect(notificationCheckbox).toHaveFocus();

      await user.keyboard(' '); // Space to toggle checkbox
      expect(notificationCheckbox).toBeChecked();

      await user.tab();
      expect(submitButton).toHaveFocus();

      // Submit with Enter key
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    it('should have proper aria-describedby for error messages', async () => {
      const user = userEvent.setup();
      render(<SettingsForm />);

      const submitButton = screen.getByRole('button', { name: /save settings/i });

      // Submit empty form
      await user.click(submitButton);

      await waitFor(() => {
        const fullNameInput = screen.getByLabelText(/full name/i);
        expect(fullNameInput).toHaveAttribute('aria-describedby', 'fullName-error');

        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
      });
    });

    it('should have associated labels for all inputs', () => {
      render(<SettingsForm />);

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const notificationCheckbox = screen.getByLabelText(/enable notification/i);

      expect(fullNameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(notificationCheckbox).toBeInTheDocument();
    });
  });

  describe('initial values', () => {
    it('should populate form with initial values', () => {
      render(
        <SettingsForm
          initialValues={{
            fullName: 'Existing User',
            email: 'existing@example.com',
            notificationPreferences: true,
          }}
        />
      );

      const fullNameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const notificationCheckbox = screen.getByLabelText(/enable notification/i) as HTMLInputElement;

      expect(fullNameInput.value).toBe('Existing User');
      expect(emailInput.value).toBe('existing@example.com');
      expect(notificationCheckbox.checked).toBe(true);
    });
  });
});
