import Link from "next/link";

export default function Placeholder({ title, detail }: { title: string; detail: string }) {
  return <main className="route-placeholder"><p className="route-placeholder__eyebrow">MEDINOW</p><h1>{title}</h1><p>{detail}</p><Link href="/">Back to Home <span aria-hidden="true">-&gt;</span></Link></main>;
}
