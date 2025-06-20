import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

export default function QuickAddTask({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() && onAdd) {
      setLoading(true);
      try {
        const success = await onAdd({ title: title.trim() });
        if (success) {
          setTitle('');
          setIsOpen(false);
        }
      } catch (error) {
        console.error('Error creating task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setTitle('');
    }
  };
  return (
    <div className="relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-surface-500 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add a task...</span>
          <div className="ml-auto text-xs text-surface-400">
            Ctrl+K
          </div>
        </button>
      ) : (
        <AnimatePresence>
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-2 bg-white border border-surface-300 rounded-lg shadow-sm"
          >
            <ApperIcon name="Plus" size={16} className="text-surface-400 flex-shrink-0" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What needs to be done?"
              className="flex-1 px-2 py-1 text-sm focus:outline-none"
              autoFocus
            />
<div className="flex items-center gap-1">
              <Button
                type="submit"
                size="sm"
                disabled={!title.trim() || loading}
                loading={loading}
              >
                {loading ? 'Adding...' : 'Add'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setTitle('');
                }}
                className="p-1 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors"
              >
                <ApperIcon name="X" size={14} />
              </button>
            </div>
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  );
}