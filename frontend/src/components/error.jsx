import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';



const Error = ({ showError, errorMessage }) => {
  return (
    <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
            onClick={() => setShowError(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#161B22] p-6 rounded-lg border border-[#30363D] max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-[#E6EDF3] text-lg font-bold mb-4">Error</h3>
              <p className="text-[#8B949E] mb-4">{errorMessage}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowError(false)}
                className="w-full bg-[#2F80ED] text-white py-2 px-4 rounded-lg font-medium"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    ) 
}

export default Error;