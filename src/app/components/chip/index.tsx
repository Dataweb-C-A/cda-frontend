import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  onClick: (values: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, onClick }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(['all']);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedValues(values);
    onClick(values);
  };

  return (
    <select multiple value={selectedValues} onChange={handleSelectChange}>
      <option value="all">All</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default MultiSelect;
