import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

// Base input styles
const baseInputClasses = "px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400 transition-colors duration-200";
const errorInputClasses = "border-red-300 focus:ring-red-500 focus:border-red-500";
const disabledClasses = "bg-gray-50 text-gray-500 cursor-not-allowed";

// Label styles
const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

// Error styles
const errorTextClasses = "text-red-600 text-sm mt-1";

// Helper text styles
const helperTextClasses = "text-gray-500 text-sm mt-1";

// Container styles
const containerClasses = "space-y-1";
const fullWidthClasses = "w-full";

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  disabled = false,
  ...props
}) => {
  const inputClasses = `
    ${baseInputClasses}
    ${error ? errorInputClasses : ''}
    ${disabled ? disabledClasses : ''}
    ${fullWidth ? fullWidthClasses : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={props.id} className={labelClasses}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        disabled={disabled}
        className={inputClasses}
      />
      {error && <p className={errorTextClasses}>{error}</p>}
      {helperText && !error && <p className={helperTextClasses}>{helperText}</p>}
    </div>
  );
};

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  rows = 4,
  className = '',
  disabled = false,
  ...props
}) => {
  const textareaClasses = `
    ${baseInputClasses}
    ${error ? errorInputClasses : ''}
    ${disabled ? disabledClasses : ''}
    ${fullWidth ? fullWidthClasses : ''}
    resize-none
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={props.id} className={labelClasses}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        {...props}
        disabled={disabled}
        rows={rows}
        className={textareaClasses}
      />
      {error && <p className={errorTextClasses}>{error}</p>}
      {helperText && !error && <p className={helperTextClasses}>{helperText}</p>}
    </div>
  );
};

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  options,
  className = '',
  disabled = false,
  ...props
}) => {
  const selectClasses = `
    ${baseInputClasses}
    ${error ? errorInputClasses : ''}
    ${disabled ? disabledClasses : ''}
    ${fullWidth ? fullWidthClasses : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={props.id} className={labelClasses}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        {...props}
        disabled={disabled}
        className={selectClasses}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={errorTextClasses}>{error}</p>}
      {helperText && !error && <p className={helperTextClasses}>{helperText}</p>}
    </div>
  );
};

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  disabled = false,
  id,
  ...props
}) => {
  const checkboxClasses = `
    w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const containerClasses = fullWidth ? "space-y-1" : "flex items-center space-x-2";

  return (
    <div className={containerClasses}>
      <div className="flex items-center">
        <input
          {...props}
          type="checkbox"
          id={id}
          disabled={disabled}
          className={checkboxClasses}
        />
        {label && (
          <label htmlFor={id} className={`ml-2 text-sm font-medium text-gray-700 ${disabled ? 'text-gray-500' : ''}`}>
            {label}
          </label>
        )}
      </div>
      {error && <p className={errorTextClasses}>{error}</p>}
      {helperText && !error && <p className={helperTextClasses}>{helperText}</p>}
    </div>
  );
};

// Specialized input components for common use cases

export const TOTPInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}> = ({ value, onChange, error, disabled = false, className = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, max 6 digits
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange(newValue);
  };

  const inputClasses = `
    w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
    text-center text-2xl font-bold tracking-widest text-gray-900 placeholder-gray-400
    ${error ? 'border-red-300 focus:ring-red-500' : ''}
    ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        TOTP Code
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="000000"
        maxLength={6}
        pattern="[0-9]{6}"
        required
        className={inputClasses}
        style={{ letterSpacing: '0.3em', fontSize: '1.5rem', fontWeight: 'bold' }}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  const inputClasses = `
    pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    outline-none text-gray-900 placeholder-gray-400
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClasses}
      />
    </div>
  );
};

export default {
  Input,
  Textarea,
  Select,
  Checkbox,
  TOTPInput,
  SearchInput
};
