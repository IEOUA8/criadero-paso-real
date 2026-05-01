import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import TermsAndConditionsModal from '@/components/TermsAndConditionsModal';
import ConditionsModal from '@/components/ConditionsModal';

const TermsCheckbox = ({ isChecked, onChange }) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <Checkbox
          id="terms-checkbox"
          checked={isChecked}
          onCheckedChange={onChange}
          className="mt-1"
        />
        <Label 
          htmlFor="terms-checkbox" 
          className="font-inter text-sm text-[#374151] leading-relaxed cursor-pointer"
        >
          Acepto los{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsTermsModalOpen(true);
            }}
            className="text-[#C8A94B] underline hover:text-[#C8A94B]/80 transition-colors"
          >
            Términos y Condiciones
          </button>
          ,{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsConditionsModalOpen(true);
            }}
            className="text-[#C8A94B] underline hover:text-[#C8A94B]/80 transition-colors"
          >
            Política de Privacidad y Tratamiento de Datos Personales
          </button>
        </Label>
      </div>

      <TermsAndConditionsModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />
      <ConditionsModal 
        isOpen={isConditionsModalOpen} 
        onClose={() => setIsConditionsModalOpen(false)} 
      />
    </>
  );
};

export default TermsCheckbox;