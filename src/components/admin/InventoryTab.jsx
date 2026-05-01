import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReproductoresInventory from './ReproductoresInventory';
import VientresInventory from './VientresInventory';
import BurrosVentaInventory from './BurrosVentaInventory';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';

const InventoryTab = () => {
  const [activeTab, setActiveTab] = useState('reproductores');

  const tabs = [
    { id: 'reproductores', label: 'Reproductores' },
    { id: 'vientres', label: 'Vientres' },
    { id: 'venta', label: 'Burros de Venta' }
  ];

  return (
    <>
      <Helmet>
        <title>Gestión de Inventario - Admin - Criadero Paso Real</title>
        <meta name="description" content="Panel administrativo para gestionar el inventario de animales del Criadero Paso Real." />
      </Helmet>
      
      <Header />

      <div className="min-h-screen bg-[#F4F5F7] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#0B0B0B] mb-2">Gestión de Inventario</h1>
            <p className="text-gray-500 font-inter">Administra el catálogo de animales del criadero.</p>
          </div>

          {/* Custom Tabs Navigation */}
          <div className="flex space-x-1 border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-6 py-4 text-sm font-medium font-inter transition-colors whitespace-nowrap
                  ${activeTab === tab.id ? 'text-[#C8A94B]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'}
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A94B]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-lg border border-[#C8A94B]/20 overflow-hidden min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'reproductores' && (
                <motion.div
                  key="reproductores"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ReproductoresInventory />
                </motion.div>
              )}
              {activeTab === 'vientres' && (
                <motion.div
                  key="vientres"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <VientresInventory />
                </motion.div>
              )}
              {activeTab === 'venta' && (
                <motion.div
                  key="venta"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <BurrosVentaInventory />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default InventoryTab;