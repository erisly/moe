import React, { CSSProperties, useEffect, useRef, useState } from 'react';

interface Props {
    content: string;
    className?: string;
    onComplete?: () => void;
    speed?: number;
    style?: CSSProperties;
}

const Marquee = (props: Props): React.ReactElement => {
    const marqueeRef = useRef<HTMLDivElement>(null);
    const [speed, setSpeed] = useState(10);

    useEffect(() => {
        setSpeed((marqueeRef.current?.getBoundingClientRect().width || 1000) / (props.speed || 100));
    }, [setSpeed, props]);

    return (
        <div className={props.className} ref={marqueeRef} style={props.style}>
            <Content data={{ ...props, speed }} />
        </div>
    );
};

const Content = ({ data }: { data: Props }): React.ReactElement => {
    const [i, setI] = useState(1);
    if (i >= 3) {
        if (data.onComplete) data.onComplete();
        return <br />;
    }
    return (
        <p
            className={`relative text-left whitespace-nowrap ${i == 1 ? 'animate-marquee-1' : 'animate-marquee-2'}`}
            onAnimationEnd={() => setI(i + 1)}
            style={{ animationDuration: `${(data.speed || 10) / 2}s` }}
        >
            {data.content}
        </p>
    );
};

export default Marquee;
