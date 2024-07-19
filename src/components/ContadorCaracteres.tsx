import React, { useState } from 'react';
import { Textarea } from './ui/textarea';

interface TextareaWithCounterProps {
  maxLength: number;
}

const TextareaWithCounter: React.FC<TextareaWithCounterProps> = ({ maxLength }) => {
  const [text, setText] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <div>
      <Textarea
        value={text}
        onChange={handleChange}
        rows={5}
        maxLength={maxLength}
        placeholder="Digite seu texto aqui..."
      />
      <div>
        <span className='text-base'>
        <strong>{text.length}</strong> caracteres
        </span>
      </div>
    </div>
  );
};

export default TextareaWithCounter;
