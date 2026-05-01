import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const MultiStepForm = ({ steps, onSubmit, title, loading, darkMode = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const step = steps[currentStep];
    const value = formData[step.id];
    
    let error = null;
    if (step.validation) {
      error = step.validation(value);
    } else if (!value && step.type !== 'checkbox') {
      error = 'Este campo es requerido';
    } else if (step.type === 'checkbox' && !value) {
      error = 'Debes aceptar para continuar';
    }

    if (error) {
      setErrors({ ...errors, [step.id]: error });
      return;
    }

    setErrors({ ...errors, [step.id]: null });
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors({ ...errors, [id]: null });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && steps[currentStep].type !== 'textarea') {
      e.preventDefault();
      handleNext();
    }
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const baseClasses = darkMode 
    ? 'glass-dark border-[#C8A94B]/30' 
    : 'glass border-white/20';
  
  const textColor = darkMode ? 'text-white' : 'text-[#0B0B0B]';
  const labelColor = darkMode ? 'text-white' : 'text-[#0B0B0B]';
  const inputBg = darkMode ? 'bg-white/10 text-white border-[#C8A94B]/50' : 'bg-white text-[#0B0B0B] border-gray-300';

  return (
    <div className={`w-full max-w-xl mx-auto ${baseClasses} rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden`}>
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1.5 bg-gray-200 w-full">
        <motion.div 
          className="h-full bg-[#C8A94B]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="mb-8 mt-2">
        <h2 className={`font-playfair text-2xl md:text-3xl font-bold ${darkMode ? 'text-[#C8A94B]' : textColor}`}>
          {title}
        </h2>
        <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'} mt-2`}>
          Paso {currentStep + 1} de {steps.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="min-h-[200px] flex flex-col justify-center"
        >
          <Label className={`text-lg md:text-xl font-medium ${labelColor} mb-6 block`}>
            {step.question}
          </Label>

          {step.type === 'text' || step.type === 'email' || step.type === 'tel' ? (
            <Input
              type={step.type}
              placeholder={step.placeholder}
              value={formData[step.id] || ''}
              onChange={(e) => handleChange(step.id, e.target.value)}
              onKeyDown={handleKeyDown}
              className={`text-lg py-6 focus-visible:ring-[#C8A94B] ${inputBg}`}
              autoFocus
            />
          ) : step.type === 'textarea' ? (
            <Textarea
              placeholder={step.placeholder}
              value={formData[step.id] || ''}
              onChange={(e) => handleChange(step.id, e.target.value)}
              className={`min-h-[120px] text-lg focus-visible:ring-[#C8A94B] ${inputBg}`}
              autoFocus
            />
          ) : step.type === 'options' ? (
            <div className="grid gap-3">
              {step.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleChange(step.id, opt)}
                  className={`p-4 text-left rounded-xl border transition-smooth ${
                    formData[step.id] === opt 
                      ? 'border-[#C8A94B] bg-[#C8A94B]/20 font-medium shadow-md' 
                      : darkMode 
                        ? 'border-white/20 bg-white/5 hover:border-[#C8A94B] hover:bg-white/10'
                        : 'border-gray-200 bg-white hover:border-[#C8A94B] hover:shadow-md'
                  } ${darkMode ? 'text-white' : 'text-[#0B0B0B]'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : step.type === 'checkbox' ? (
            <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border transition-smooth ${
              darkMode 
                ? 'bg-white/5 border-white/20 hover:border-[#C8A94B]' 
                : 'bg-white border-gray-200 hover:border-[#C8A94B]'
            }`}>
              <input
                type="checkbox"
                checked={formData[step.id] || false}
                onChange={(e) => handleChange(step.id, e.target.checked)}
                className="mt-1 w-5 h-5 accent-[#C8A94B] text-[#C8A94B] rounded focus:ring-[#C8A94B]"
              />
              <span className={`${darkMode ? 'text-white' : 'text-gray-700'} leading-relaxed`}>
                {step.placeholder}
              </span>
            </label>
          ) : null}

          {errors[step.id] && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-500 text-sm mt-3 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {errors[step.id]}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className={`mt-8 flex justify-between items-center pt-6 border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentStep === 0 || loading}
          className={darkMode ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-[#0B0B0B]'}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Atrás
        </Button>
        <Button
          onClick={handleNext}
          disabled={loading}
          className="bg-[#C8A94B] hover:bg-[#C8A94B]/90 text-[#0B0B0B] font-bold px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-smooth"
        >
          {loading ? 'Procesando...' : currentStep === steps.length - 1 ? 'Enviar' : 'Siguiente'}
          {!loading && currentStep !== steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default MultiStepForm;