'use client';
import dynamic from "next/dynamic";
const DiasporaMap = dynamic(() => import("./DiasporaMap"), { ssr: false });
export default function Page() { return <DiasporaMap />; }
