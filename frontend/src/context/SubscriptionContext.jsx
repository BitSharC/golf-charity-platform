import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SubscriptionModal from '../components/SubscriptionModal';

const SubscriptionContext = createContext();

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [activeCharity, setActiveCharity] = useState(null);

  const openSubscription = (charity = null) => {
    // Determine the active charity if not provided (e.g. they clicked from Navbar instead of Charity Directiory)
    setActiveCharity(charity || { 
      id: 'general-fund', 
      name: 'Global Impact Pool', 
      description: 'Contributions are intelligently distributed to top-performing charities aligned with maximum impact.',
      image_url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&q=80&w=400',
      category: 'General'
    });
    setIsSubscribeOpen(true);
  };

  const closeSubscription = () => {
    setIsSubscribeOpen(false);
    // Add small delay to allow Framer exit animation to complete before clearing data
    setTimeout(() => setActiveCharity(null), 300); 
  };

  return (
    <SubscriptionContext.Provider value={{ openSubscription, closeSubscription, isSubscribeOpen }}>
      {children}
      
      {/* Global Modal rendering wrapping with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {isSubscribeOpen && activeCharity && (
          <SubscriptionModal 
            selectedCharity={activeCharity} 
            onClose={closeSubscription} 
          />
        )}
      </AnimatePresence>
    </SubscriptionContext.Provider>
  );
};
