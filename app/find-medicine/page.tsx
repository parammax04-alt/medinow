'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

type IconName = "arrow" | "back" | "cart" | "capsule" | "filter" | "mic" | "search" | "category" | "clock" | "flame" | "drop" | "leaf" | "baby" | "skin" | "body" | "sort" | "medicine" | "shield" | "pharmacy" | "price";

const categories: Array<[string, IconName]> = [["PAIN RELIEF", "capsule"], ["COLD & FLU", "category"], ["VITAMINS", "leaf"], ["DIABETES CARE", "drop"], ["DIGESTIVE HEALTH", "body"], ["SKIN CARE", "skin"], ["PERSONAL CARE", "medicine"], ["BABY CARE", "baby"]];

function Icon({ name }: { name: IconName }) {
	const paths: Record<IconName, React.ReactNode> = {
		arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>, back: <><path d="M19 12H5M11 6l-6 6 6 6" /></>, cart: <><path d="M4 5h2l1.6 9.2a2 2 0 0 0 2 1.7h6.8a2 2 0 0 0 1.9-1.4L20 8H7" /><circle cx="10" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></>, capsule: <><rect x="5" y="8" width="14" height="8" rx="4" transform="rotate(-35 12 12)" /><path d="m9 8 6 8" /></>, filter: <><path d="M4 7h8M16 7h4M4 17h4M12 17h8" /><circle cx="14" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>, mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" /></>, search: <><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4.5 4.5" /></>, category: <><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" /></>, clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>, flame: <path d="M12 21c4.4 0 7-2.8 7-6.8 0-3.1-2.1-5.7-4.8-8.2.2 2.2-.7 3.5-1.8 4.4C12.7 6.6 10.8 4.2 9 3c.5 3.3-3 5.5-3 10.6C6 18 8.4 21 12 21Z" />, drop: <path d="M12 3S6 10.3 6 14.5a6 6 0 0 0 12 0C18 10.3 12 3 12 3Z" />, leaf: <><path d="M20 4C10 4 5 8 5 15c0 3 2 5 5 5 7 0 10-6 10-16Z" /><path d="M4 21c3-5 7-8 12-11" /></>, baby: <><circle cx="12" cy="12" r="8" /><path d="M8 10h.01M16 10h.01M9 15c2 1 4 1 6 0" /></>, skin: <><circle cx="12" cy="12" r="8" /><path d="M8 12c1.5-2 6.5-2 8 0M9 16c2 1 4 1 6 0" /></>, body: <><path d="M8 5c1 2 2 3 4 3s3-1 4-3M8 19c1-2 2-3 4-3s3 1 4 3M8 5v5c0 1-1 2-2 3s-1 3 1 4M16 5v5c0 1 1 2 2 3s1 3-1 4" /></>, medicine: <><rect x="8" y="3" width="8" height="18" rx="2" /><path d="M10 7h4M10 12h4M10 17h4" /></>, sort: <><path d="M4 7h16M7 12h10M10 17h4" /></>, shield: <><path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>, pharmacy: <><path d="M4 10h16v10H4zM7 10V7h10v3M9 14h6M12 11v6" /></>, price: <><circle cx="12" cy="12" r="8" /><path d="M12 7v10M15 9.5c-.6-.7-1.5-1-3-1-1.5 0-2.5.7-2.5 1.8 0 3 5.5 1.2 5.5 4.2 0 1.1-1 2-3 2-1.3 0-2.3-.3-3-1" /></>,
	};
	return <svg className="find-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function ResultCard() {
	return <article className="find-result-card"><div className="result-columns"><div><p><Icon name="medicine" />MEDICINE</p><p><Icon name="medicine" />MEDICINE TYPE</p><p><Icon name="capsule" />FORM</p><p><Icon name="medicine" />PACK SIZE</p></div><div><p><Icon name="shield" />PRESCRIPTION STATUS</p><p><Icon name="pharmacy" />PHARMACY AVAILABILITY</p><p><Icon name="price" />PRICE</p></div></div><button type="button" onClick={() => window.location.href = "/medicine-availability"}>VIEW AVAILABILITY <Icon name="arrow" /></button></article>;
}

export default function FindMedicinePage() {
	const router = useRouter();
	const [query, setQuery] = useState("");
	return <main className="find-screen">
		<header className="find-header"><button type="button" aria-label="Back to home" onClick={() => router.push("/")}><Icon name="back" /></button><strong><span>MEDI</span>NOW</strong><button type="button" aria-label="Open cart" onClick={() => router.push("/cart")}><Icon name="cart" /></button></header>
		<div className="find-content">
			<section className="find-hero"><h1>Find <span>Medicine</span></h1><p>Search for medicines and find pharmacies<br />that have them available.</p></section>
			<label className="find-search"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SEARCH MEDICINES, BRANDS OR GENERIC NAMES" aria-label="Search medicines, brands or generic names" /><Icon name="mic" /><i /><button type="button" aria-label="Clear search" onClick={() => setQuery("")}>×</button></label>
			<section className="find-section"><div className="find-section-heading"><h2>Browse Categories</h2><button type="button">VIEW ALL <Icon name="arrow" /></button></div><div className="category-grid">{categories.map(([title, icon]) => <button type="button" className="category-card" key={title} onClick={() => setQuery(title)}><Icon name={icon} /><strong>{title}</strong></button>)}</div></section>
			<section className="find-section chip-section"><div className="find-section-heading"><h2><Icon name="clock" />Recent Searches</h2><button type="button">CLEAR ALL</button></div><div className="search-chips">{[1, 2, 3, 4].map((item) => <button type="button" key={item} onClick={() => setQuery("")}><Icon name="clock" />RECENT SEARCH</button>)}</div></section>
			<section className="find-section chip-section"><div className="find-section-heading"><h2><Icon name="flame" />Popular Searches</h2></div><div className="search-chips">{[1, 2, 3, 4].map((item) => <button type="button" key={item} onClick={() => setQuery("")}><Icon name="search" />POPULAR SEARCH</button>)}</div></section>
			<section className="find-results"><div className="find-results-heading"><h2>Search Results</h2><button type="button"><Icon name="filter" />FILTER</button></div><button className="sort-select" type="button"><span>SORT BY</span><Icon name="sort" /></button><div className="result-list">{[1, 2, 3, 4].map((item) => <ResultCard key={item} />)}</div></section>
		</div>
	</main>;
}
