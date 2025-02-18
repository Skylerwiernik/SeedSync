import React from 'react';

export const Popup = ({ isVisible, children }) => {
    if (!isVisible) return null;
    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <div className="popup-content">
                    {children}
                </div>
            </div>
        </div>
    );
};