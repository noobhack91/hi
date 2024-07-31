import React, { useEffect, useRef } from 'react';

interface SchedulerProps {
    refreshTime: number;
    watchOn: boolean;
    triggerFunction: () => void;
}

const Scheduler: React.FC<SchedulerProps> = ({ refreshTime, watchOn, triggerFunction }) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const cancelSchedule = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const startSchedule = () => {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(triggerFunction, refreshTime * 1000);
        }
    };

    useEffect(() => {
        if (refreshTime > 0) {
            if (watchOn) {
                cancelSchedule();
            } else {
                startSchedule();
            }
        }

        return () => {
            cancelSchedule();
        };
    }, [watchOn, refreshTime]);

    useEffect(() => {
        triggerFunction();
    }, []);

    return null;
};

export default Scheduler;
