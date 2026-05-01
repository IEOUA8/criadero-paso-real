import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQAccordion = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="glass-card rounded-2xl p-5 mb-4 transition-accordion max-[389px]:p-4">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 text-left hover:bg-white/60 rounded-xl transition-accordion cursor-pointer p-1"
      >
        <h3 className="font-inter text-base font-bold text-[#0B0B0B] flex-1 max-[389px]:text-[0.95rem]">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-0.5"
        >
          <ChevronDown className="w-5 h-5 text-[#C8A94B] max-[389px]:w-4 max-[389px]:h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div 
              className="font-inter text-sm md:text-base text-[#374151] max-[389px]:text-[0.9rem]" 
              style={{ lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQAccordion;
