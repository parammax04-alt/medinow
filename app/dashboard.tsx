'use client';

import { useRouter } from "next/navigation";

type IconName = "search" | "mic" | "filter" | "capsule" | "prescription" | "cart" | "orders" | "pharmacy" | "saved" | "truck" | "arrow" | "cube" | "clock" | "pin" | "star" | "status";

type MedicineAvailability = { medicine: string; pharmacy: string; stock: string; price: string; delivery: string };
type Pharmacy = { name: string; distance: string; rating: string; status: "open" | "closed"; delivery: string; availableMedicines: number };
type Order = { id: string; medicines: string; pharmacy: string; status: string; delivery: string; amount: string };
type SavedMedicine = { medicine: string; variant: string; lastOrdered: string; availability: string };

const medicineAvailability: MedicineAvailability[] = [];
const nearbyPharmacies: Pharmacy[] = [];
const activeOrders: Order[] = [];
const recentOrders: Order[] = [];
const savedMedicines: SavedMedicine[] = [];

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" /></>,
    filter: <><path d="M4 7h8M16 7h4M4 17h4M12 17h8" /><circle cx="14" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>,
    capsule: <><rect x="5" y="8" width="14" height="8" rx="4" transform="rotate(-35 12 12)" /><path d="m9 8 6 8" /></>,
    prescription: <><path d="M6 3.5h9l3 3V20.5H6z" /><path d="M14 3.5v4h4M9 13h6M12 10v6" /></>,
    cart: <><path d="M4 5h2l1.6 9.2a2 2 0 0 0 2 1.7h6.8a2 2 0 0 0 1.9-1.4L20 8H7" /><circle cx="10" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></>,
    orders: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="M4 12l8 4 8-4M4 17l8 4 8-4" /></>,
    pharmacy: <><path d="M4 10h16v10H4zM7 10V7h10v3M9 14h6M12 11v6" /><path d="M3 20h18" /></>,
    saved: <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.5L6 21z" />,
    truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    cube: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
    pin: <><path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" /><circle cx="12" cy="10" r="2.2" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
    status: <><circle cx="12" cy="12" r="8.5" /><path d="M12 8v4M12 16h.01" /></>,
  };
  return <svg className="dashboard-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function SectionHeader({ icon, title, detail, actions, onAction }: { icon: IconName; title: string; detail: string; actions?: string[]; onAction?: (action: string) => void }) {
  return <div className="section-header"><div className="section-heading"><span><Icon name={icon} /></span><div><h2>{title}</h2><p>{detail}</p></div></div>{actions && <div className="section-actions">{actions.map((action) => <button type="button" key={action} onClick={() => onAction?.(action)}>{action}{action !== "VIEW MORE" && action !== "VIEW ALL" ? <Icon name="search" /> : <Icon name="arrow" />}</button>)}</div>}</div>;
}

function Skeleton({ className = "" }: { className?: string }) { return <span className={`skeleton ${className}`} aria-hidden="true" />; }
function RowSkeleton({ columns = 5 }: { columns?: number }) { return <div className="table-skeleton">{Array.from({ length: columns }).map((_, index) => <Skeleton key={index} className={index === columns - 1 ? "skeleton-circle" : ""} />)}</div>; }

export default function Dashboard() {
  const router = useRouter();
  const go = (path: string) => router.push(path);
  const quickActions: Array<{ title: string; detail: string; icon: IconName; path: string }> = [
    { title: "FIND MEDICINE", detail: "Search and compare medicines and brands.", icon: "capsule", path: "/find-medicine" },
    { title: "UPLOAD PRESCRIPTION", detail: "Upload and get faster availability.", icon: "prescription", path: "/prescription" },
    { title: "MY CART", detail: "View and manage your cart items.", icon: "cart", path: "/cart" },
    { title: "MY ORDERS", detail: "Track and manage your orders.", icon: "orders", path: "/orders" },
  ];

  return <main className="dashboard-screen">
    <div className="dashboard-content">
      <header className="dashboard-topbar"><div className="dashboard-brand"><strong><span>MEDI</span>NOW</strong><small>Better Health. Faster.</small></div></header>
      <button className="medicine-search" type="button" onClick={() => go("/find-medicine")}><Icon name="search" /><span>Search medicines, brands or health products...</span><i /><Icon name="mic" /><i /><Icon name="filter" /></button>
      <section className="dashboard-section quick-section"><h2 className="standalone-title">Quick Actions</h2><div className="quick-grid">{quickActions.map((action) => <button className="quick-card" type="button" key={action.title} onClick={() => go(action.path)}><span className="quick-card__icon"><Icon name={action.icon} /></span><strong>{action.title}</strong><small>{action.detail}</small><Icon name="arrow" /></button>)}</div></section>
      <section className="dashboard-section dashboard-panel"><SectionHeader icon="capsule" title="Medicine Availability" detail="Check medicine availability across pharmacies." actions={["SEARCH ALL MEDICINES", "VIEW MORE"]} onAction={() => go("/find-medicine")} /><div className="table-wrap"><div className="table-head"><span>MEDICINE</span><span>PHARMACY</span><span>STOCK STATUS</span><span>PRICE</span><span>EST. DELIVERY</span><span>ACTION</span></div>{medicineAvailability.length ? medicineAvailability.map((medicine) => <div key={medicine.medicine} />) : Array.from({ length: 4 }).map((_, index) => <RowSkeleton key={index} columns={6} />)}</div></section>
      <section className="dashboard-section dashboard-panel"><SectionHeader icon="pharmacy" title="Nearby Pharmacies" detail="Find pharmacies near your delivery location." actions={["VIEW ALL"]} onAction={() => go("/pharmacies")} /><div className="pharmacy-grid">{nearbyPharmacies.length ? nearbyPharmacies.map((pharmacy) => <div key={pharmacy.name} />) : Array.from({ length: 3 }).map((_, index) => <article className="pharmacy-card" key={index}><div className="pharmacy-card__icon"><Icon name="pharmacy" /></div><Skeleton className="skeleton-title" />{["pharmacy", "distance", "rating", "status", "delivery", "available medicines"].map((label) => <div className="pharmacy-detail" key={label}><Icon name={label === "distance" ? "pin" : label === "rating" ? "star" : label === "delivery" ? "truck" : label === "status" ? "clock" : label === "available medicines" ? "capsule" : "pharmacy"} /><span>{label.toUpperCase()}</span><Skeleton /></div>)}<button type="button" onClick={() => go("/pharmacies")}>VIEW PHARMACY <Icon name="arrow" /></button></article>)}</div></section>
      <div className="dashboard-two-column"><section className="dashboard-panel"><SectionHeader icon="cube" title="Active Orders" detail="Track your ongoing orders." actions={["VIEW ALL"]} onAction={() => go("/orders")} /><div className="table-wrap compact-table"><div className="table-head"><span>ORDER ID</span><span>MEDICINES</span><span>PHARMACY</span><span>STATUS</span><span>EXPECTED DELIVERY</span><span>ACTION</span></div>{activeOrders.length ? activeOrders.map((order) => <div key={order.id} />) : Array.from({ length: 3 }).map((_, index) => <RowSkeleton key={index} columns={6} />)}</div><button className="panel-action" type="button" onClick={() => go("/orders")}><Icon name="pin" />TRACK ORDER<Icon name="arrow" /></button></section><section className="dashboard-panel"><SectionHeader icon="clock" title="Recent Orders" detail="" actions={[]} /><div className="table-wrap compact-table"><div className="table-head"><span>ORDER ID</span><span>DATE</span><span>PHARMACY</span><span>AMOUNT</span><span>STATUS</span></div>{recentOrders.length ? recentOrders.map((order) => <div key={order.id} />) : Array.from({ length: 3 }).map((_, index) => <RowSkeleton key={index} columns={5} />)}</div><button className="panel-action panel-action--right" type="button" onClick={() => go("/orders")}>VIEW ALL<Icon name="arrow" /></button></section></div>
      <section className="dashboard-section dashboard-panel saved-panel"><SectionHeader icon="saved" title="Saved Medicines" detail="Quickly order your frequently used medicines." actions={["VIEW ALL"]} onAction={() => go("/saved-medicines")} /><div className="saved-grid">{savedMedicines.length ? savedMedicines.map((medicine) => <div key={medicine.medicine} />) : Array.from({ length: 4 }).map((_, index) => <article className="saved-card" key={index}><div className="saved-card__icon"><Icon name="capsule" /></div>{["MEDICINE", "DOSAGE / VARIANT", "LAST ORDERED", "AVAILABILITY"].map((label) => <div className="saved-line" key={label}><small>{label}</small><Skeleton /></div>)}<button type="button" onClick={() => go("/find-medicine")}>ORDER AGAIN <Icon name="arrow" /></button></article>)}</div></section>
    </div>
  </main>;
}
