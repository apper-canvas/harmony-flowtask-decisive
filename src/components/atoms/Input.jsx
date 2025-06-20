import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  error,
  icon,
  type = 'text',
  className = '',
  required = false,
  fullWidth = true,
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = props.value || props.defaultValue;
  const isFloating = focused || hasValue;
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const inputClasses = `
    w-full px-3 pb-2 pt-6 text-sm border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    ${error ? 'border-error focus:border-error focus:ring-error/50' : 'border-surface-300'}
    ${icon ? 'pl-10' : ''}
    ${type === 'password' ? 'pr-10' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {/* Icon */}
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <ApperIcon 
            name={icon} 
            size={16} 
            className={`${focused ? 'text-primary' : 'text-surface-400'} transition-colors`}
          />
        </div>
      )}

      {/* Input */}
      <input
        ref={ref}
        type={inputType}
        className={inputClasses}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        {...props}
      />

      {/* Floating Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            top: isFloating ? '0.5rem' : '50%',
            fontSize: isFloating ? '0.75rem' : '0.875rem',
            transform: isFloating ? 'translateY(0)' : 'translateY(-50%)',
            color: focused ? '#4F46E5' : error ? '#EF4444' : '#6B7280'
          }}
          className={`absolute left-3 pointer-events-none transition-all duration-200 ${icon ? 'left-10' : 'left-3'}`}
        >
          {label} {required && <span className="text-error">*</span>}
        </motion.label>
      )}

      {/* Password Toggle */}
      {type === 'password' && (
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onClick={() => setShowPassword(!showPassword)}
        >
          <ApperIcon 
            name={showPassword ? 'EyeOff' : 'Eye'} 
            size={16} 
            className="text-surface-400 hover:text-surface-600 transition-colors"
          />
        </button>
      )}

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center gap-1"
        >
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;