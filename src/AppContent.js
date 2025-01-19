import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import OwnerInterface from './components/OwnerInterface';
import UserInterface from './components/UserInterface';
import { connectWallet } from './utils/wallet';
import { contractABI, contractAddress } from './utils/contract';
import { Wallet, User, Shield } from 'lucide-react';

function AppContent() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      if (isMobile()) {
        if (typeof window.ethereum === 'undefined') {
          window.location.href = 'https://metamask.app.link/dapp/https://kichuman28.github.io/ipfs/';
          return;
        }
      }

      if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
        const provider = window.ethereum || window.web3.currentProvider;
        const { signer: walletSigner, provider: walletProvider } = await connectWallet();
        const walletAddress = await walletSigner.getAddress();
        setSigner(walletSigner);
        setProvider(walletProvider);
        setWalletConnected(true);
        setWalletAddress(walletAddress);
        await checkIfOwner(walletSigner);
      } else {
        alert('Please install MetaMask or use the MetaMask mobile app!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const isMobile = () => {
    const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
    return toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
  };

  const checkIfOwner = async (signer) => {
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const ownerAddress = await contract.owner();
      const signerAddress = await signer.getAddress();
      setIsOwner(ownerAddress.toLowerCase() === signerAddress.toLowerCase());
    } catch (error) {
      console.error('Error checking owner status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E4F9F5] to-[#E4F9F5] flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.h1 
        className="text-5xl font-bold mb-12 text-[#30E3CA]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Reclaim
      </motion.h1>

      {!walletConnected ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            className={`bg-[#30E3CA] hover:bg-[#11999E] px-8 py-4 rounded-full text-white text-lg font-semibold transition-all duration-300 flex items-center ${loading ? 'animate-pulse' : ''}`}
            onClick={handleConnectWallet}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet className="mr-2" size={24} />
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {isOwner ? (
            <OwnerInterface />
          ) : (
            <UserInterface walletAddress={walletAddress} signer={signer} />
          )}
        </motion.div>
      )}
    </div>
  );
}

export default AppContent;