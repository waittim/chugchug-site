import { useState } from 'react';

export const usePressHandlers = () => {
  const [isPressed, setIsPressed] = useState(false);
  return {
    isPressed,
    pressProps: {
      onPointerDown: (event) => {
        if (!event.isPrimary) return;
        setIsPressed(true);
      },
      onPointerUp: () => setIsPressed(false),
      onPointerCancel: () => setIsPressed(false),
      onPointerLeave: () => setIsPressed(false),
    },
  };
};
