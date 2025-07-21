import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Toast = ({ show, message, type = 'success' }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-[#28A745]' : 'bg-red-500'
          } text-white`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
