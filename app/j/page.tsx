'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

type Presence = { code: string; count: number };

export default function JoinPage() {
  const qs = useSearchParams();
  const [code, setCode] = useState('');
  const [connected, setConnected] = useState(false);
  const [presence, setPresence] = useState<Presence | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Use env var in prod, fall back to localhost during dev
  const apiBase = useMemo(() => {
    const envUrl = process.env.NEXT_PUBLIC_API_BASE?.trim();
    return envUrl && envUrl.length > 0 ? envUrl : 'http://localhost:3000';
  }, []);

  // hydrate code from ?c=LA123
  useEffect(() => {
    const c = qs.get('c');
    if (c) setCode(c.toUpperCase());
  }, [qs]);

  // connect socket on mount; clean up on unmount
  useEffect(() => {
    const s = io(apiBase, { transports: ['websocket'], autoConnect: true });
    socketRef.current = s;

    const onConnect = () => {
      setConnected(true);
      setError(null);
    };
    const onDisconnect = () => setConnected(false);
    const onConnectError = (e: any) => setError(e?.message || 'Connection error');

    const onPresence = (p: Presence) => setPresence(p);
    const onEvent = (payload: any) => {
      // for now just log any broadcast events from host
      // eslint-disable-next-line no-console
      console.log('event:', payload);
    };

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('connect_error', onConnectError);
    s.on('presence', onPresence);
    s.on('event', onEvent);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('connect_error', onConnectError);
      s.off('presence', onPresence);
      s.off('event', onEvent);
      s.close();
    };
  }, [apiBase]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const c = code.trim().toUpperCase();
    if (!c) return setError('Enter a session code.');
    socketRef.current?.emit('join-session', { code: c });
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center">
      <div className="w-full max-w-md mx-auto p-6">
        <h1 className="text-3xl font-semibold tracking-tight">Join a Session</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Enter the code from the host (e.g., <code className="text-neutral-300">LA123</code>).
        </p>

        <div className="mt-4 flex items-center gap-2">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${
              connected ? 'bg-emerald-500' : 'bg-neutral-600'
            }`}
            aria-hidden
          />
          <span className="text-xs uppercase tracking-wide">
            {connected ? 'Connected' : 'Connecting…'}
          </span>
        </div>

        <form onSubmit={handleJoin} className="mt-6 space-y-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter code (e.g., LA123)"
            className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 px-4 py-3 text-base font-medium transition"
            disabled={!connected}
          >
            Join
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {presence && (
          <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="text-sm text-neutral-400">Session</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-semibold">{presence.code}</span>
              <span className="text-sm text-neutral-400">•</span>
              <span className="text-sm text-neutral-300">
                {presence.count} {presence.count === 1 ? 'person' : 'people'} here
              </span>
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-neutral-500">
          Tip: append <code>?c=LA123</code> to the URL to prefill the code.
        </p>
      </div>
    </main>
  );
}
