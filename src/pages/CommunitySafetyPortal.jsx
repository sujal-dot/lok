import React, { useState } from 'react';

const CommunitySafetyPortal = () => {
  const [activeTab, setActiveTab] = useState('heatmap');
  const [sosActive, setSosActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSosClick = () => {
    setSosActive(true);
    setTimeout(() => {
      setSosActive(false);
    }, 3000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    e.target.reset();
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-blue-800 text-white p-6 rounded-lg mb-6 text-center">
        <h1 className="text-2xl font-bold">Community Safety Portal</h1>
      </div>
      
      <button 
        onClick={handleSosClick}
        className={`bg-red-600 hover:bg-red-700 text-white py-4 px-6 text-xl rounded-lg w-full mb-6 transition-all ${sosActive ? 'animate-pulse' : ''}`}
      >
        {sosActive ? 'Emergency Services Notified' : 'SOS EMERGENCY'}
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow hover:-translate-y-1 transition-all">
          <div className="text-gray-600 text-sm mb-1">Cases Solved</div>
          <div className="text-2xl font-bold text-blue-800">124</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:-translate-y-1 transition-all">
          <div className="text-gray-600 text-sm mb-1">In Progress</div>
          <div className="text-2xl font-bold text-blue-800">45</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow hover:-translate-y-1 transition-all">
          <div className="text-gray-600 text-sm mb-1">Total Reported</div>
          <div className="text-2xl font-bold text-blue-800">169</div>
        </div>
      </div>
      
      <div className="flex mb-4">
        <div 
          className={`px-4 py-2 cursor-pointer rounded-t-lg ${activeTab === 'heatmap' ? 'bg-white border-b-2 border-blue-800' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('heatmap')}
        >
          Safety Heatmap
        </div>
        <div 
          className={`px-4 py-2 cursor-pointer rounded-t-lg ml-2 ${activeTab === 'report' ? 'bg-white border-b-2 border-blue-800' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('report')}
        >
          Report Incident
        </div>
      </div>
      
      {activeTab === 'heatmap' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Safety Heatmap</h2>
          <div className="h-[300px] w-full rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
            <p className="text-gray-500">Heatmap visualization would appear here</p>
          </div>
        </div>
      )}
      
      {activeTab === 'report' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Report an Incident</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Incident Type</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Theft</option>
                <option>Assault</option>
                <option>Suspicious Activity</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Description</label>
              <textarea className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"></textarea>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Location</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <button type="submit" className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900">
              Submit Report
            </button>
            {showSuccess && (
              <div className="bg-green-500 text-white p-3 rounded-md mt-3">
                Report submitted successfully!
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default CommunitySafetyPortal;