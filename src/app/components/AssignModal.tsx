import React, { useState } from 'react';
import Select from 'react-select';

interface AssignModalProps {
  type: 'mobile' | 'vehicle';
  onClose: () => void;
  onAssign: (itemId: number, isPermanent: boolean) => void;
}

const AssignModal: React.FC<AssignModalProps> = ({ type, onClose, onAssign }) => {
  const [selectedItem, setSelectedItem] = useState<{ value: number; label: string } | null>(null);
  const [isPermanent, setIsPermanent] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">
          Assign {type === 'mobile' ? 'Mobile' : 'Vehicle'}
        </h2>
        <Select
          options={[] /* Populate this with API data */}
          onChange={(option) => setSelectedItem(option)}
          isClearable
          placeholder={`Select a ${type === 'mobile' ? 'Mobile' : 'Vehicle'}`}
          className="mb-4"
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isPermanent}
            onChange={() => setIsPermanent(!isPermanent)}
            className="mr-2"
          />
          Permanent Assignment
        </label>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white py-2 px-4 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => onAssign(selectedItem?.value || 0, isPermanent)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;
