import React, { Suspense } from "react";
import ClientWrapper from './ClientWrapper';

export default function Page() {
  return (
    <Suspense fallback={<div>Yuklanmoqda...</div>}>
      <ClientWrapper />
    </Suspense>
  );
}
