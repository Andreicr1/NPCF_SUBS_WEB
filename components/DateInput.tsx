// @ts-nocheck
'use client';

import React from 'react';

interface DateInputProps {
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

export default function DateInput({ 
  id, 
  name, 
  label, 
  required = false, 
  value = '', 
  onChange,
  className = '',
  placeholder = 'dd/mm/aaaa'
}: DateInputProps) {
  
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    let inputValue = e.currentTarget.value.replace(/\D/g, '');
    
    // Formata automaticamente dd/mm/yyyy
    if (inputValue.length >= 2) {
      inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
    }
    if (inputValue.length >= 5) {
      inputValue = inputValue.slice(0, 5) + '/' + inputValue.slice(5, 9);
    }
    
    e.currentTarget.value = inputValue;
    
    // Dispara o evento onChange se fornecido
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: e.currentTarget,
        currentTarget: e.currentTarget,
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite: backspace, delete, tab, escape, enter
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'];
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Permite números
    if (e.key >= '0' && e.key <= '9') {
      return;
    }
    
    // Bloqueia tudo o resto
    e.preventDefault();
  };

  return (
    <div>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="text"
        id={id || name}
        name={name}
        required={required}
        value={value}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        pattern="\d{2}/\d{2}/\d{4}"
        placeholder={placeholder}
        maxLength={10}
        className={className || "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"}
      />
    </div>
  );
}
