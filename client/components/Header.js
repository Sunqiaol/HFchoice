import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { USER_ROLES } from '../constants';

const Header = ({ user, role, cart = [], cartItemCount = 0, onCartClick, onAddItemClick }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.push('/login');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const isAdmin = role === USER_ROLES.ADMIN;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Image src="/favicon.ico" alt="HF Choice" width={24} height={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">HF Choice</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Professional Equipment Store</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Products
            </button>
            
            {isAdmin && (
              <button
                onClick={onAddItemClick}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Product</span>
              </button>
            )}

            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="hidden lg:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                  <p className="text-gray-500">{role}</p>
                </div>
              </div>

              {/* Cart Button (Non-Admin) */}
              {!isAdmin && (
                <button
                  onClick={onCartClick}
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  aria-label="Shopping cart"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.6 3.2a1 1 0 001 1.4h9.2M16 19a2 2 0 11-4 0 2 2 0 014 0zM9 19a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-gentle">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="btn-secondary text-sm"
              >
                Sign Out
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {!isAdmin && (
              <button
                onClick={onCartClick}
                className="relative p-2 text-gray-700"
                aria-label="Shopping cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.6 3.2a1 1 0 001 1.4h9.2M16 19a2 2 0 11-4 0 2 2 0 014 0zM9 19a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                  <p className="text-gray-500 text-sm">{role}</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-2 py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Products
              </button>
              
              {isAdmin && (
                <button
                  onClick={() => {
                    onAddItemClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-2 text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Product</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-2 py-2 text-red-600 hover:text-red-700 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;