'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const AllStudents = dynamic(() => import('./AllStudentsClient'), {
  ssr: false,
});

export default function ClientWrapper() {
  return <AllStudents />;
}
