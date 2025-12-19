import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Store, CreditCard, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomeModal = ({ onSelect }) => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(null);
  const [buyerChoice, setBuyerChoice] = useState(null); // 'register' or 'browse'
  const navigate = useNavigate();
  
  console.log('WelcomeModal rendered');

  const handleSelect = (type) => {
    setSelectedType(type);
    if (type === 'buyer') {
      // Don't redirect yet, show buyer options
      setBuyerChoice(null);
    } else {
      // For seller, redirect to payment page
      localStorage.setItem('userType', type);
      onSelect('seller');
      setTimeout(() => {
        navigate('/seller-payment');
      }, 300);
    }
  };

  const handleBuyerChoice = (choice) => {
    localStorage.setItem('userType', 'buyer');
    if (choice === 'register') {
      onSelect('buyer');
      setTimeout(() => {
        navigate('/register');
      }, 300);
    } else {
      // Browse without account - close modal
      onSelect('buyer');
      // Modal will close via onSelect callback
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in" style={{ zIndex: 10000 }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-8 w-8" />
            <h2 className="text-2xl font-bold">{t('welcomeModal.title')}</h2>
          </div>
          <button
            onClick={() => {
              // Allow browsing without account
              localStorage.setItem('userType', 'buyer');
              onSelect('buyer');
              setSelectedType(null);
              setBuyerChoice('browse');
            }}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label={t('welcomeModal.close')}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-gray-600 text-center mb-8 text-lg">
            {t('welcomeModal.subtitle')}
          </p>

          {selectedType !== 'buyer' || buyerChoice !== null ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Buyer Option */}
              <button
                onClick={() => handleSelect('buyer')}
                className={`p-6 border-4 rounded-xl transition-all transform hover:scale-105 ${
                  selectedType === 'buyer'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${
                    selectedType === 'buyer' ? 'bg-primary-600' : 'bg-gray-100'
                  }`}>
                    <ShoppingBag className={`h-12 w-12 ${
                      selectedType === 'buyer' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t('welcomeModal.buyer.title')}</h3>
                  <p className="text-gray-600">
                    {t('welcomeModal.buyer.description')}
                  </p>
                  <ul className="text-left text-sm text-gray-600 space-y-2 mt-4">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {t('welcomeModal.buyer.freeAccount')}
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {t('welcomeModal.buyer.browseAll')}
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {t('welcomeModal.buyer.cartWishlist')}
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {t('welcomeModal.buyer.contactSellers')}
                    </li>
                  </ul>
                </div>
              </button>

              {/* Seller Option */}
              <button
                onClick={() => handleSelect('seller')}
                className={`p-6 border-4 rounded-xl transition-all transform hover:scale-105 ${
                  selectedType === 'seller'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${
                    selectedType === 'seller' ? 'bg-primary-600' : 'bg-gray-100'
                  }`}>
                    <Store className={`h-12 w-12 ${
                      selectedType === 'seller' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t('welcomeModal.seller.title')}</h3>
                  <p className="text-gray-600">
                    {t('welcomeModal.seller.description')}
                  </p>
                  <ul className="text-left text-sm text-gray-600 space-y-2 mt-4">
                    <li className="flex items-center">
                      <CreditCard className="h-4 w-4 text-primary-600 mr-2" />
                      <span className="font-semibold text-primary-600">{t('welcomeModal.seller.paymentRequired')}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {t('welcomeModal.seller.unlimitedListings')}
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {t('welcomeModal.seller.sellerDashboard')}
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {t('welcomeModal.seller.manageSales')}
                    </li>
                  </ul>
                </div>
              </button>
            </div>
          ) : (
            /* Buyer Choice Options */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('welcomeModal.buyerChoice.title')}</h3>
                <p className="text-gray-600">{t('welcomeModal.buyerChoice.subtitle')}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Create Account Option */}
                <button
                  onClick={() => handleBuyerChoice('register')}
                  className="p-6 border-4 border-primary-600 bg-primary-50 rounded-xl transition-all transform hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-full bg-primary-600">
                      <ShoppingBag className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{t('welcomeModal.buyerChoice.createAccount.title')}</h3>
                    <p className="text-gray-600">
                      {t('welcomeModal.buyerChoice.createAccount.description')}
                    </p>
                    <ul className="text-left text-sm text-gray-600 space-y-2 mt-4">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {t('welcomeModal.buyerChoice.createAccount.saveFavorites')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {t('welcomeModal.buyerChoice.createAccount.trackOrders')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {t('welcomeModal.buyerChoice.createAccount.contactSellers')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {t('welcomeModal.buyerChoice.createAccount.recommendations')}
                      </li>
                    </ul>
                  </div>
                </button>

                {/* Browse Without Account Option */}
                <button
                  onClick={() => handleBuyerChoice('browse')}
                  className="p-6 border-4 border-gray-200 hover:border-primary-300 rounded-xl transition-all transform hover:scale-105 bg-white"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-full bg-gray-100">
                      <ShoppingBag className="h-12 w-12 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{t('welcomeModal.buyerChoice.browseWithoutAccount.title')}</h3>
                    <p className="text-gray-600">
                      {t('welcomeModal.buyerChoice.browseWithoutAccount.description')}
                    </p>
                    <ul className="text-left text-sm text-gray-600 space-y-2 mt-4">
                      <li className="flex items-center">
                        <span className="text-blue-500 mr-2">ℹ</span>
                        {t('welcomeModal.buyerChoice.browseWithoutAccount.browseAll')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-blue-500 mr-2">ℹ</span>
                        {t('welcomeModal.buyerChoice.browseWithoutAccount.viewDetails')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-orange-500 mr-2">!</span>
                        {t('welcomeModal.buyerChoice.browseWithoutAccount.limitedFeatures')}
                      </li>
                      <li className="flex items-center">
                        <span className="text-orange-500 mr-2">!</span>
                        {t('welcomeModal.buyerChoice.browseWithoutAccount.signUpAnytime')}
                      </li>
                    </ul>
                  </div>
                </button>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    setSelectedType(null);
                    setBuyerChoice(null);
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('welcomeModal.buyerChoice.back')}
                </button>
              </div>
            </div>
          )}

          {selectedType !== 'buyer' && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                {t('welcomeModal.changeLater')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;

