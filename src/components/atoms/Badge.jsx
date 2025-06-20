import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

export default function Badge({ 
  children, 
  variant = 'default', 
  size = 'sm',
  icon,
  removable = false,
  onRemove,
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border';
  
  const variants = {
    default: 'text-surface-700 bg-surface-100 border-surface-200',
    primary: 'text-primary bg-primary/10 border-primary/20',
    secondary: 'text-secondary bg-secondary/10 border-secondary/20',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    error: 'text-error bg-error/10 border-error/20',
    info: 'text-info bg-info/10 border-info/20'
  };
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };
  
  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14
  };
  
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={classes}
      {...props}
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? 'mr-1' : ''} 
        />
      )}
      
      {children}
      
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={`ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors ${children ? 'ml-1' : ''}`}
        >
          <ApperIcon name="X" size={iconSizes[size]} />
        </button>
      )}
    </motion.span>
  );
}