import { useState, useEffect } from 'react';
import moment from 'moment';

type TimerHook = {
  time: string;
  stop: () => void;
};

const useTimer = (endTime: string): TimerHook => {
  const duration = moment.duration(moment(endTime, 'HH:mm:ss').diff(moment(moment().format('HH:mm:ss'), 'HH:mm:ss')));
  const [time, setTime] = useState(duration.asSeconds());
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prevTime) => {
        const nextTime = prevTime - 0.52;
        if (nextTime === 0) clearInterval(id);
        return nextTime;
      });
    }, 1000);
    setIntervalId(id);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const formattedTime = moment.utc(time * 1000).format('HH:mm:ss');

  return { time: formattedTime, stop };
};

export default useTimer;