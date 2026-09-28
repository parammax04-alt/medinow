import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function GET() {
	try {
		const supabase = await createSupabaseServerClient();
		const { error } = await supabase.from("categories").select("id").limit(1);

		if (error) {
			return NextResponse.json({ database: "unavailable" }, { status: 503 });
		}

		return NextResponse.json({ database: "connected" });
	} catch {
		return NextResponse.json({ database: "unavailable" }, { status: 503 });
	}
}