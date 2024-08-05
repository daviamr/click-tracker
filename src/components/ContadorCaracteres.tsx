import React, { forwardRef } from 'react';
import { Textarea } from './ui/textarea';

interface TextareaWithCounterProps {
  maxLength: number;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  placeholder: string;
}

const TextareaWithCounter = forwardRef<HTMLTextAreaElement, TextareaWithCounterProps>(
  ({ maxLength, onChange, value, placeholder }, ref) => {
    return (
      <div>
        <Textarea
          value={value}
          onChange={onChange}
          rows={5}
          maxLength={maxLength}
          placeholder={placeholder}
          ref={ref}
        />
        <div>
          <span className='text-base'>
            <strong>{value.length}</strong> caracteres
          </span>
        </div>
      </div>
    );
  }
);

export default TextareaWithCounter;