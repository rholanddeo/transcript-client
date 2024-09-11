import React, { FC } from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (transcript: string) => void;
  initialTranscript?: string;
}

const Modal: FC<ModalProps> = ({ show, onClose, onSave, initialTranscript = '' }) => {
  const [transcript, setTranscript] = React.useState(initialTranscript);

  if (!show) return null; // Modal is hidden when `show` is false

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Add Transcript</h2>
        
        <textarea
          className="border p-2 w-full h-40 resize-none"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Enter transcript here..."
        />
        
        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => onSave(transcript)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
