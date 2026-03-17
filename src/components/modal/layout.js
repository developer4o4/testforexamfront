"use client";
import React, { useEffect } from 'react';
import './modal.scss';

const Modal = ({ children, showModal, onClose }) => {
  // Modal ochiq turganda orqa fon skroll bo'lmasligi uchun
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} // Ichki qism bosilganda yopilmasligi uchun
      >
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;