// app/verify/page.tsx
import { Suspense } from "react";
import VerifyContent from "./VerifyContent";

// A simple fallback component
function VerifySkeleton() {
  return <div>Loading verification...</div>;
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifySkeleton />}>
      <VerifyContent />
    </Suspense>
  );
}