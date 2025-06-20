import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { aiService, taskService } from '@/services';

export default function AIChat({ isOpen, onToggle }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);
    setInputValue('');
    setIsProcessing(true);

    try {
      const response = await aiService.processMessage(userMessage.content);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        extractedData: response.extractedData,
        suggestions: response.suggestions
      };

      addMessage(assistantMessage);
      setExtractedData(response.extractedData);

    } catch (error) {
      console.error('AI processing error:', error);
      addMessage({
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.create(taskData);
      toast.success('Task created successfully!');
      setExtractedData(null);
      
      // Add confirmation message
      addMessage({
        role: 'assistant',
        content: `Perfect! I've created the task "${taskData.title}" for you. You can find it in your task list.`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Task creation error:', error);
      toast.error('Failed to create task');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Create a task to review quarterly reports by Friday",
    "Schedule 1-on-1 meetings with my team next week",
    "Remind me to call the client about project updates",
    "Add a high priority task to prepare presentation slides"
  ];

  return (
    <>
      {/* AI Chat Button */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-all
          ${isOpen ? 'bg-surface-600' : 'bg-gradient-to-r from-primary to-secondary'}
        `}
      >
        <ApperIcon 
          name={isOpen ? 'X' : 'MessageCircle'} 
          size={24} 
          className={`text-white ${!isOpen && isProcessing ? 'ai-pulse' : ''}`} 
        />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-6 bottom-24 w-96 h-96 bg-white rounded-lg shadow-2xl border border-surface-200 z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <ApperIcon name="Bot" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold">FlowTask AI</h3>
                  <p className="text-xs text-white/80">Your productivity assistant</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-surface-500 py-8">
                  <div className="text-4xl mb-3">🤖</div>
                  <p className="text-sm mb-4">Hi! I'm your AI assistant. I can help you create and manage tasks using natural language.</p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-surface-700">Try saying:</p>
                    {quickPrompts.slice(0, 2).map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(prompt)}
                        className="block w-full text-left px-3 py-2 text-xs bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 text-surface-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    
                    {/* Task Creation UI */}
                    {message.role === 'assistant' && message.extractedData && (
                      <div className="mt-3 p-3 bg-white rounded border border-surface-200">
                        <h4 className="text-xs font-semibold text-surface-700 mb-2">
                          Extracted Task Details:
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div><strong>Title:</strong> {message.extractedData.title}</div>
                          <div><strong>Priority:</strong> {message.extractedData.priority}</div>
                          {message.extractedData.dueDate && (
                            <div><strong>Due Date:</strong> {message.extractedData.dueDate}</div>
                          )}
                          {message.extractedData.estimatedMinutes && (
                            <div><strong>Estimated Time:</strong> {message.extractedData.estimatedMinutes} minutes</div>
                          )}
                        </div>
                        <Button
                          onClick={() => handleCreateTask(message.extractedData)}
                          size="sm"
                          className="mt-2 w-full"
                        >
                          Create Task
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-surface-100 px-3 py-2 rounded-lg flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-surface-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-surface-600">AI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-surface-200">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your task..."
                    className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    rows={2}
                    disabled={isProcessing}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  size="sm"
                  icon="Send"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}