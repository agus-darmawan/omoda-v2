import { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

interface JoyMessage {
    header: {
        seq: number;
        stamp: {
            secs: number;
            nsecs: number;
        };
        frame_id: string;
    };
    axes: number[];
    buttons: number[];
}

function RosComponent() {
    const [ros, setRos] = useState<ROSLIB.Ros | null>(null);
    const [connected, setConnected] = useState(false);
    const [joyData, setJoyData] = useState<JoyMessage | null>(null);

    useEffect(() => {
        const rosInstance = new ROSLIB.Ros({
            url: 'ws://localhost:9090'
        });

        rosInstance.on('connection', () => {
            console.log('Connected to rosbridge WebSocket!');
            setConnected(true);
        });

        rosInstance.on('error', (error: Error) => {
            console.log('Error connecting to rosbridge WebSocket: ', error);
        });

        rosInstance.on('close', () => {
            console.log('Connection to rosbridge WebSocket closed!');
            setConnected(false);
        });

        if (connected) {
            const joyTopic = new ROSLIB.Topic({
                ros: rosInstance,
                name: '/joy',
                messageType: 'sensor_msgs/Joy'
            });

            joyTopic.subscribe((message: ROSLIB.Message) => {
                const joyMessage = message as JoyMessage;
                setJoyData(joyMessage);
            });

            return () => {
                joyTopic.unsubscribe();
            };
        }

        setRos(rosInstance);
    }, [connected]);

    return { connected, joyData };
}

export default RosComponent;
