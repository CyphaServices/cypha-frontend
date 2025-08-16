'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';

const apiBase = process.env.NEXT_PUBLIC_API_BASE || ''; // e.g. https://api.cyphaent.com
const socket = io(apiBase, { transports: ['websocket'] });

export default function JoinPage() {
  const qs = useSearchParams();
  const [code, setCode] = useState('');

  useEffect(() => {
    const c = qs.get('c');
    if (c) setCode(c);
  }, [qs]);

  useEffect(() => {
    const onPresence = (data: any) => console.log('presence:', data);
    const onEvent = (payload: any) => console.log('event:', payload);
    socket.on('presence', onPresence);
    socket.on('event', onEvent);
    return () => {
      socket.off('presence', onPresence);
      socket.off('event', onEvent);
    };
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    socket.emit('join-session', { code });
  };

  return (
    <main style={{maxWidth: 480, margin: '40px auto', fontFamily: 'system-ui'}}>
      <h1>Join a Session</h1>
      <form onSubmit={handleJoin}>
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code (e.g., LA123)"
          style={{width:'100%', padding:12, fontSize:18, marginBottom:12}}
        />
        <button
          type="submit"
          style={{width:'100%', padding:12, fontSize:18, cursor:'pointer'}}
        >
          Join
        </button>
      </form>
      <p style={{marginTop:12, opacity:.7}}>Tip: try <code>?c=LA123</code> in the URL</p>
    </main>
  );
}
