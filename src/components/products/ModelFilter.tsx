import React from 'react';
import { productModels } from '@/data/mockProducts';
import { cn } from '@/lib/utils';

interface ModelFilterProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelFilter: React.FC<ModelFilterProps> = ({ selectedModel, onModelChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {productModels.map((model) => (
        <button
          key={model}
          onClick={() => onModelChange(model)}
          className={cn(
            'model-filter-btn',
            selectedModel === model && 'active'
          )}
        >
          {model}
        </button>
      ))}
    </div>
  );
};

export default ModelFilter;
