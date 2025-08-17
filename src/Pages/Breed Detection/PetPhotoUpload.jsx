import React, { useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function PetPhotoUpload({ onUpload }) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      console.log('Selected file:', file);
      onUpload?.(); // ✅ Trigger parent callback after upload
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      console.log('Dropped file:', file);
      onUpload?.(); // ✅ Trigger parent callback after drop
    }
  };

  const preventDefault = (e) => e.preventDefault();

  return (
    <section className="w-full px-4 py-12 flex justify-center">
      <label
        htmlFor="fileUpload"
        onDrop={handleDrop}
        onDragOver={preventDefault}
        onDragEnter={preventDefault}
        onDragLeave={preventDefault}
        className="w-full max-w-2xl p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl shadow-md cursor-pointer transition-all duration-300 ease-in-out hover:border-purple-700 hover:shadow-lg focus:outline-none"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <CloudArrowUpIcon className="h-12 w-12 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-700">Drag & Drop Your Pet’s Photo</h2>
          <p className="text-sm text-gray-500">or click to browse files</p>

          {/* Custom label-styled button */}
          <label
            htmlFor="fileUpload"
            className="bg-purple-600 text-white py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            Choose File
          </label>

          {fileName && <p className="text-sm text-purple-600 mt-2 font-medium">{fileName}</p>}
        </div>

        {/* Hidden file input */}
        <input
          id="fileUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          aria-label="File upload input"
        />
      </label>
    </section>
  );
}
