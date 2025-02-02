import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send, MapPin, Image } from 'lucide-react';
import Modal from './Modal';
import { pinata } from '../utils/config';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/contract';
import appLogo from '../app_icon.png';

// Color palette:
// #E4F9F5 - Light mint (primary-light)
// #30E3CA - Turquoise (primary)
// #11999E - Teal (primary-dark)
// #40514E - Dark gray (secondary)

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
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {selectedImage ? (
        <motion.div 
          className="w-full space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-full aspect-video object-cover"
            />
          </div>
          
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="description" className="block text-sm font-medium text-[#11999E] mb-2">
              Incident Details
            </label>
            <textarea
              id="description"
              rows="4"
              className="shadow-sm focus:ring-[#30E3CA] focus:border-[#30E3CA] mt-1 block w-full sm:text-sm border border-[#E4F9F5] rounded-md p-3"
              placeholder="Describe the incident in detail (type of drugs, suspicious activities, etc.). Your report helps in creating safer communities..."
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
            <label htmlFor="location" className="block text-sm font-medium text-[#11999E] mb-2">
              Incident Location
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="location"
                className="shadow-sm focus:ring-[#30E3CA] focus:border-[#30E3CA] block w-full sm:text-sm border border-[#E4F9F5] rounded-md p-3"
                value={location}
                readOnly
              />
              <button
                onClick={getLocation}
                className="ml-2 p-3 bg-[#E4F9F5] rounded-md hover:bg-[#30E3CA]/20 transition-colors"
                disabled={isGettingLocation}
              >
                <MapPin className={`text-[#11999E] ${isGettingLocation ? 'animate-spin' : ''}`} size={20} />
              </button>
            </div>
            <p className="mt-1 text-xs text-[#40514E]">Location data is encrypted for your privacy</p>
          </motion.div>

          <div className="space-y-4 pt-4">
            {!isUploaded && (
              <motion.button
                className={`bg-[#30E3CA] hover:bg-[#11999E] px-6 py-4 rounded-xl text-white w-full flex items-center justify-center shadow-lg transform transition-all duration-200 ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102'
                }`}
                onClick={handleUpload}
                disabled={isUploading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="mr-2" size={20} />
                {isUploading ? 'Encrypting & Uploading...' : 'Secure Upload'}
              </motion.button>
            )}

            {isUploaded && (
              <motion.button
                className="bg-[#11999E] hover:bg-[#30E3CA] px-6 py-4 rounded-xl text-white w-full flex items-center justify-center shadow-lg transform transition-all duration-200"
                onClick={handleSubmitReport}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="mr-2" size={20} />
                Submit Anonymous Report
              </motion.button>
            )}

            <motion.button
              className="bg-[#09122C] hover:bg-[#872341] px-6 py-4 rounded-xl text-white w-full flex items-center justify-center shadow-lg transform transition-all duration-200"
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image className="mr-2" size={20} />
              Choose Different Image
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="flex flex-col items-center px-6 py-12 bg-[#09122C] text-[#E17564] rounded-xl border-2 border-dashed border-[#872341] cursor-pointer hover:bg-[#09122C]/70 transition-colors duration-200">
            <Image className="w-12 h-12 mb-4 text-[#11999E]" />
            <span className="text-lg font-medium text-[#11999E]">Upload Evidence</span>
            <span className="text-sm text-[#11999E]/60 mt-2">All images are encrypted for privacy</span>
            <input
              type='file'
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </label>
          <p className="text-xs text-[#40514E] text-center mt-4">
            Supported formats: JPG, PNG, HEIC • Max size: 10MB
          </p>
        </motion.div>
      )}
      {isModalOpen && <Modal uploadUrl={uploadUrl} closeModal={() => setIsModalOpen(false)} />}
    </motion.div>
  );
}

export default WebcamCapture;