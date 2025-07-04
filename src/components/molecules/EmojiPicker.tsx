import React from 'react';

/**
 * Props for the EmojiPicker component
 */
interface EmojiPickerProps {
  /** Whether the emoji picker is currently open */
  isOpen: boolean;
  /** Callback function when the picker is closed */
  onClose: () => void;
  /** Callback function when an emoji is selected, receives the emoji character */
  onEmojiSelect: (emoji: string) => void;
  /** Position coordinates for rendering the picker */
  position: { top: number; left: number };
}

const emojis = [
  '👍',
  '❤️',
  '😊',
  '😂',
  '😱',
  '😢',
  '🏃',
  '💯',
  '🔥',
  '👏',
  '☀️',
  '🎉',
  '🌈',
  '🙌',
  '💡',
  '🎶',
  '😎',
  '🤔',
  '🧠',
  '🍕',
  '🌟',
  '🚀',
  '🐶',
  '🐱',
  '🌍',
  '📚',
  '🎯',
  '🥳',
  '🤖',
  '🎨',
  '🧘',
  '🏆',
  '💥',
  '💖',
  '😇',
  '😜',
  '🌸',
  '💬',
  '📸',
  '🛠️',
  '⏰',
  '🧩',
  '🗺️',
];

/**
 * EmojiPicker component displays a grid of emoji characters for selection
 *
 * Features:
 * - Positioned at specified coordinates
 * - Backdrop for easy dismissal
 * - Grid layout of common emojis
 * - Accessible emoji buttons
 */
const EmojiPicker: React.FC<EmojiPickerProps> = ({ isOpen, onClose, onEmojiSelect, position }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />

      {/* Emoji Picker */}
      <div
        className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 grid grid-cols-4 gap-2"
        style={{
          top: position.top,
          left: position.left,
          minWidth: '200px',
        }}
        role="dialog"
        aria-label="Emoji picker"
      >
        {emojis.map((emoji) => (
          <button
            key={emoji}
            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            onClick={() => onEmojiSelect(emoji)}
            aria-label={`Emoji ${emoji}`}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
};

export default EmojiPicker;
