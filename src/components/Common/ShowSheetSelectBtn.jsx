import React from 'react';

export default function ShowSheetSelectBtn({ btnID, isSelected, onSelectClick }) {
    return (
        <button
            id={btnID}
            onClick={() => onSelectClick(btnID)}
            className={isSelected ? 'selected' : ''}
        >
            {isSelected ? 'Selected' : 'Select'}
        </button>
    );
}
