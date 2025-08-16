'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

type PresencePayload = { code: string; count: number };
type HostEventPayload = Record<string, unknown>;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export default function JoinPage() {
  const qs = useSearchParams();
  const [code, setCode] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!API_BASE) return;
    const s = io(API_BASE, { transports: ['websocket'] });
    socketRef.current = s;

    const onPresence = (data: PresencePayload) => {
      console.log('presence:', data);
    };
    const onEvent = (payload: HostEventPayload) => {
      console.log('event:', payload);
    };

    s.on('presence', onPresence);
    s.on('event', onEvent);

    return () => {
      s.off('presence', onPresence);
      s.off('event', onEvent);
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    const c = qs.get('c');
    if (c) setCode(c.toUpperCase());
  }, [qs]);

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code) return;
    socketRef.current?.emit('join-session', { code });
  };

  return (
    <main style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>Join a Session</h1>
      <form onSubmit={handleJoin}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code (e.g., LA123)"
          style={{ width: '100%', padding: 12, fontSize: 18, marginBottom: 12 }}
        />
        <button type="submit" style={{ width: '100%', padding: 12, fontSize: 18, cursor: 'pointer' }}>
          Join
        </button>
      </form>
      <p style={{ marginTop: 12, opacity: 0.7 }}>Tip: try <code>?c=LA123</code> in the URL</p>
    </main>
  );
}