import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ endValue, duration = 1000, startValue = 0 }) => {
  const [count, setCount] = useState(startValue);

  useEffect(() => {
    if (endValue === 0) {
      setCount(0);
      return;
    }

    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Usar uma função de easing para tornar a animação mais suave
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      
      const currentCount = Math.floor(easedProgress * endValue);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration, startValue]);

  // Formatação de número para grandes valores
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <span className="animated-counter">
      {formatNumber(count)}
    </span>
  );
};

export default AnimatedCounter;
