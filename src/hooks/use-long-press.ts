import { useEffect, useRef, useState } from 'react';

export default function useLongPress(callback = () => { }, ms = 300) {
    const [startLongPress, setStartLongPress] = useState(false);
    const timerId = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {

        if (startLongPress) {
            timerId.current = setTimeout(callback, ms);
        } else {
            if (timerId.current) clearTimeout(timerId.current);
        }

        return () => {
            if (timerId.current) clearTimeout(timerId.current);
        };
    }, [callback, ms, startLongPress]);

    return {
        onMouseDown: () => setStartLongPress(true),
        onMouseUp: () => setStartLongPress(false),
        onMouseLeave: () => setStartLongPress(false),
        onTouchStart: () => setStartLongPress(true),
        onTouchEnd: () => setStartLongPress(false),
    };
}