import { useState, useEffect } from "react";

interface UseTimerProps {
  from: Date;
  to: Date;
}

const useTimer = ({ from, to }: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date().getTime();
    const difference = to.getTime() - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { timeLeft, isTimeOver: timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 };
};

export default useTimer;
