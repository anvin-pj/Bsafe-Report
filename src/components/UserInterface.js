import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Image, Upload, Send, MapPin } from 'lucide-react';
import { pinata } from '../utils/config';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/contract';
import Modal from './Modal';
import SuccessPage from './SuccessPage';

function UserInterface({ walletAddress, signer }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadUrl, setUploadUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

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

  const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
  };

  const redirectToApp = () => {
    if (isAndroid()) {
      window.location.href = 'intent://reclaim#Intent;scheme=reclaim;package=com.example.reclaim;end';
    }
  };

  const handleSubmitReport = async () => {
    if (!uploadUrl) return;
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.submitReport(description, location, uploadUrl);
      await tx.wait();
      console.log("Report submitted successfully!");
      
      setShowSuccess(true);
      if (isAndroid()) {
        setTimeout(redirectToApp, 3000);
      }
      
      setSelectedImage(null);
      setDescription('');
      setLocation('');
      setIsUploaded(false);
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <motion.div 
        className="bg-white rounded-3xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Wallet Connection */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <User size={20} className="text-[#30E3CA]" />
          <span>Connected to wallet: <span className="text-[#30E3CA]">{walletAddress}</span></span>
        </div>

        {/* Dashboard Title */}
        <h2 className="text-2xl font-bold text-center text-[#30E3CA] mb-8">
          
        </h2>

        {/* Main Content Area */}
        <div className="bg-[#E4F9F5] rounded-2xl p-6">
          <h1 className="text-4xl font-bold text-center text-[#30E3CA] mb-6">
            SafeReport
          </h1>

          <p className="text-center text-[#40514E] mb-8">
            Anonymously report crime incidents. Your identity remains protected while helping create safer communities.
          </p>

          {/* Rewards Box */}
          <div className="bg-white/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🎁</span>
              <h3 className="text-xl text-[#11999E]">
                Rewards for Verified Reports
              </h3>
            </div>
            <p className="text-center text-[#40514E]">
              Submit accurate reports and earn rewards upon verification
            </p>
          </div>

          {selectedImage ? (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="w-full aspect-video object-cover"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-[#11999E] mb-2">
                  Incident Details
                </label>
                <textarea
                  rows="4"
                  className="w-full p-3 rounded-xl border border-[#30E3CA] focus:ring-[#30E3CA] focus:border-[#30E3CA]"
                  placeholder="Describe the incident..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isUploaded ? (
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full bg-[#30E3CA] hover:bg-[#11999E] text-white py-3 rounded-xl flex items-center justify-center"
                  >
                    <Upload className="mr-2" size={20} />
                    {isUploading ? 'Uploading...' : 'Upload Report'}
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitReport}
                    className="w-full bg-[#11999E] hover:bg-[#30E3CA] text-white py-3 rounded-xl flex items-center justify-center"
                  >
                    <Send className="mr-2" size={20} />
                    Submit Report
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-full bg-[#40514E] hover:bg-[#11999E] text-white py-3 rounded-xl"
                >
                  Choose Different Image
                </button>
              </div>
            </div>
          ) : (
            /* Upload Evidence Box */
            <label className="border-2 border-dashed border-[#30E3CA] rounded-2xl p-8 text-center cursor-pointer hover:bg-white/30 transition-colors block">
              <Image className="w-12 h-12 mx-auto mb-4 text-[#30E3CA]" />
              <h3 className="text-xl text-[#11999E] mb-2">Upload Evidence</h3>
              <p className="text-sm text-[#40514E] mb-6">
                All images are encrypted for privacy
              </p>
              <p className="text-xs text-[#40514E]">
                Supported formats: JPG, PNG, HEIC • Max size: 10MB
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          )}
        </div>
      </motion.div>
      
      {/* Success Page Modal */}
      {showSuccess && <SuccessPage onClose={handleSuccessClose} />}
      
      {/* Existing Modal */}
      {isModalOpen && <Modal uploadUrl={uploadUrl} closeModal={() => setIsModalOpen(false)} />}
    </>
  );
}

export default UserInterface;