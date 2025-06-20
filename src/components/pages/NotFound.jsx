import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="text-8xl mb-6"
        >
          🤖
        </motion.div>

        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-surface-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-surface-600 mb-8">
          Oops! The page you're looking for doesn't exist. 
          The FlowTask AI might have reorganized things for better productivity!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate('/')}
            icon="Home"
          >
            Go to Tasks
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            icon="ArrowLeft"
          >
            Go Back
          </Button>
        </div>

        <div className="mt-8 p-4 bg-primary/5 rounded-lg">
          <div className="flex items-center gap-3 text-sm text-surface-600">
            <ApperIcon name="Lightbulb" size={16} className="text-primary" />
            <span>
              Try using the AI assistant to quickly navigate or create what you need!
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}