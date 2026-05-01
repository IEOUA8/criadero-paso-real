import React, { useState } from 'react';
import FAQAccordion from '@/components/FAQAccordion';

const FAQSection = ({ title, faqs, isFirstSection = false }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`${!isFirstSection ? 'mt-10 md:mt-12' : ''}`}>
      <div className="mb-5 md:mb-6">
        <p className="premium-kicker mb-2 max-[389px]:text-[10px] max-[389px]:tracking-[0.09em]">Seccion FAQ</p>
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#0B0B0B] max-[389px]:text-[1.35rem]">
        {title}
        </h2>
      </div>
      <div>
        {faqs.map((faq, index) => (
          <FAQAccordion
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
