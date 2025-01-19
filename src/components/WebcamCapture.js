import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send, MapPin, Image } from 'lucide-react';
import Modal from './Modal';
import { pinata } from '../utils/config';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/contract';

function WebcamCapture({ walletAddress, signer }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadUrl, setUploadUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location unavailable");
          setIsGettingLocation(false);
        }
      );
    } else {
      setLocation("Geolocation not supported");
      setIsGettingLocation(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    setIsUploading(true);
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob, 'photo.jpg');

      const uploadResponse = await pinata.post('/pinning/pinFileToIPFS', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = uploadResponse.data;
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      setUploadUrl(ipfsUrl);
      setIsUploaded(true);
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!uploadUrl) return;
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.submitReport(description, location, uploadUrl);
      await tx.wait();
      console.log("Report submitted successfully!");
      // You might want to add some state here to show a success message
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setIsUploaded(false);
    setDescription('');
    getLocation();
  };

  return (
    <motion.div 
      className="flex flex-col items-center bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-bold text-secondary mb-6">Upload Evidence</h2>
      
      {selectedImage ? (
        <motion.div 
          className="w-full space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <img src={selectedImage} alt="Selected" className="mb-4 w-full rounded-lg shadow-lg" />
          
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="description" className="block text-sm font-medium text-secondary mb-2">
              Fill Description
            </label>
            <textarea
              id="description"
              rows="3"
              className="shadow-sm focus:ring-primary-dark focus:border-primary-dark mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Describe the captured evidence..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </motion.div>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="location" className="block text-sm font-medium text-secondary mb-2">
              Location
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="location"
                className="shadow-sm focus:ring-primary-dark focus:border-primary-dark block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                value={location}
                readOnly
              />
              <button
                onClick={getLocation}
                className="ml-2 p-2 bg-primary-light rounded-md"
                disabled={isGettingLocation}
              >
                <MapPin className={`text-primary-dark ${isGettingLocation ? 'animate-spin' : ''}`} size={20} />
              </button>
            </div>
          </motion.div>

          {!isUploaded && (
            <motion.button
              className={`bg-primary-dark hover:bg-secondary px-6 py-3 rounded-full text-white w-full flex items-center justify-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleUpload}
              disabled={isUploading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="mr-2" size={20} />
              {isUploading ? 'Uploading...' : 'Upload to IPFS'}
            </motion.button>
          )}

          {isUploaded && (
            <motion.button
              className="bg-primary hover:bg-primary-dark px-6 py-3 rounded-full text-white w-full flex items-center justify-center"
              onClick={handleSubmitReport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="mr-2" size={20} />
              Submit Report
            </motion.button>
          )}

          <motion.button
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full text-white w-full flex items-center justify-center"
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image className="mr-2" size={20} />
            Choose Another Image
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          className="w-full space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="flex flex-col items-center px-4 py-6 bg-white text-primary rounded-lg shadow-lg tracking-wide border border-primary cursor-pointer hover:bg-primary hover:text-white transition-colors duration-200">
            <Image className="w-8 h-8" />
            <span className="mt-2 text-base">Select an image</span>
            <input
              type='file'
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </label>
        </motion.div>
      )}
      {isModalOpen && <Modal uploadUrl={uploadUrl} closeModal={() => setIsModalOpen(false)} />}
    </motion.div>
  );
}

export default WebcamCapture;