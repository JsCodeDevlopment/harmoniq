"use client";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { SongViewer } from "@/components/song/song-viewer";

export default function SongPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        </div>
      }
    >
      <SongViewer />
    </Suspense>
  );
}
