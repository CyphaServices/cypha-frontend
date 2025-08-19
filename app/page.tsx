// app/page.tsx
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/hub/index.html');
  return null; // ensure a return value
}