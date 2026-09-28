'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import availabilityImage from "../../images/availabity.jpeg";

export default function MedicineAvailabilityPage() {
	const router = useRouter();
	return <main className="availability-reference">
		<div className="availability-reference__primary">
			<Image className="availability-reference__image" src={availabilityImage} alt="Medicine availability screen" priority sizes="(max-width: 768px) 100vw, 768px" />
			<button className="availability-reference__back" type="button" aria-label="Back to find medicine" onClick={() => router.push("/find-medicine")} />
			<button className="availability-reference__cart" type="button" aria-label="Open cart" onClick={() => router.push("/cart")} />
			<button className="availability-reference__medicine availability-reference__medicine--first" type="button" aria-label="View medicine" onClick={() => router.push("/medicine-details")} />
			<button className="availability-reference__medicine availability-reference__medicine--second" type="button" aria-label="View medicine" onClick={() => router.push("/medicine-details")} />
		</div>
		<div className="availability-reference__clone availability-reference__clone--pharmacies">
			<Image className="availability-reference__image" src={availabilityImage} alt="Medicine availability screen duplicate" sizes="(max-width: 768px) 100vw, 768px" />
			<button className="availability-reference__medicine availability-reference__medicine--clone-first" type="button" aria-label="View medicine" onClick={() => router.push("/medicine-details")} />
			<button className="availability-reference__medicine availability-reference__medicine--clone-second" type="button" aria-label="View medicine" onClick={() => router.push("/medicine-details")} />
		</div>
	</main>;
}