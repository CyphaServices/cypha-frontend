// app/page.tsx
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/index.html');
  return null; // ensure a return value
}