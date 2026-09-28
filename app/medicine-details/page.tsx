'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import medicineDetailsImage from "../../images/WhatsApp Image 2026-09-25 at 12.37.27 PM.jpeg";

export default function MedicineDetailsPage() {
	const router = useRouter();
	return <main className="availability-reference medicine-details-reference">
		<Image className="availability-reference__image" src={medicineDetailsImage} alt="Medicine details screen" priority sizes="(max-width: 768px) 100vw, 768px" />
		<button className="availability-reference__back" type="button" aria-label="Back to medicine availability" onClick={() => router.push("/medicine-availability")} />
		<button className="availability-reference__cart" type="button" aria-label="Open cart" onClick={() => router.push("/cart")} />
	</main>;
}