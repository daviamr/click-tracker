import React, { forwardRef } from 'react';
import { Textarea } from './ui/textarea';

interface TextareaWithCounterProps {
  maxLength: number;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
}

const TextareaWithCounter = forwardRef<HTMLTextAreaElement, TextareaWithCounterProps>(
  ({ maxLength, onChange, value }, ref) => {
    return (
      <div>
        <Textarea
          value={value}
          onChange={onChange}
          rows={5}
          maxLength={maxLength}
          placeholder="Digite seu texto aqui..."
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