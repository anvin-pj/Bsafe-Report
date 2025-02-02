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

  useEffect(() => {
    // Check if Android and should redirect to app
    const isAndroid = /Android/i.test(navigator.userAgent);
    const shouldRedirectToApp = new URLSearchParams(window.location.search).get('redirect') === 'app';
    
    if (isAndroid && shouldRedirectToApp) {
      // Replace 'your.app.package' with your actual Android app package name
      window.location.href = 'intent://bsafe#Intent;scheme=bsafe;package=com.example.bsafe';
    }
  }, []);

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      if (isMobile()) {
        if (typeof window.ethereum === 'undefined') {
          if (/Android/i.test(navigator.userAgent)) {
            // Redirect to Play Store or your Android app
            window.location.href = 'intent://bsafe#Intent;scheme=bsafe;package=com.example.bsafe;end';
            return;
          } else {
            window.location.href = 'https://metamask.app.link/dapp/kichuman28.github.io/ipfs/';
            return;
          }
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
    <div className="min-h-screen bg-gradient-to-br from-[#BE3144] to-[#872341] flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img 
          src={process.env.PUBLIC_URL + '/bsafe_logo.png'} 
          className="w-48 h-48"
          alt="Bsafe Logo" 
        />
      </motion.div>
      <motion.h1 
        className="text-5xl font-bold mb-12 text-[#E17564]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Bsafe
      </motion.h1>

      {!walletConnected ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            className={`bg-[#09122C] hover:bg-[#872341] px-8 py-4 rounded-full text-white text-lg font-semibold transition-all duration-300 flex items-center ${loading ? 'animate-pulse' : ''}`}
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