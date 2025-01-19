import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

function SuccessPage({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-md w-full mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CheckCircle className="w-16 h-16 text-[#30E3CA] mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-[#11999E] mb-4">Report Submitted Successfully!</h2>
          <p className="text-[#40514E] mb-6">
            Your report has been securely submitted and encrypted. You will receive rewards upon verification.
          </p>
          <button
            onClick={onClose}
            className="bg-[#30E3CA] hover:bg-[#11999E] text-white px-8 py-3 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SuccessPage; 