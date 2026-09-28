import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

const resources = ["categories", "pharmacies", "medicines", "inventory", "orders", "prescriptions"] as const;
type Resource = (typeof resources)[number];
const writableResources = ["categories", "pharmacies", "medicines", "inventory"] as const;

async function getAdminClient() {
	const supabase = await createSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return { supabase: null, response: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };

	const { data: profile, error } = await supabase.from("users").select("role").eq("id", user.id).single();
	if (error || profile?.role !== "admin") return { supabase: null, response: NextResponse.json({ error: "Admin access required" }, { status: 403 }) };
	return { supabase, response: null };
}

export async function GET() {
	const { supabase, response } = await getAdminClient();
	if (response) return response;
	const results = await Promise.all(resources.map((resource) => supabase!.from(resource).select("*").order("created_at", { ascending: false }).limit(100)));
	const failed = results.find((result) => result.error);
	if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 400 });
	return NextResponse.json(Object.fromEntries(resources.map((resource, index) => [resource, results[index].data ?? []])));
}

export async function POST(request: Request) {
	const { supabase, response } = await getAdminClient();
	if (response) return response;
	const body = await request.json() as { resource?: Resource; values?: Record<string, unknown> };
	if (!body.resource || !writableResources.includes(body.resource as (typeof writableResources)[number]) || !body.values) return NextResponse.json({ error: "Invalid resource or values" }, { status: 400 });

	const { resource, values } = body;
	const { data, error } = await supabase!.from(resource).insert(values).select().single();
	if (error) return NextResponse.json({ error: error.message }, { status: 400 });
	return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: Request) {
	const { supabase, response } = await getAdminClient();
	if (response) return response;
	const body = await request.json() as { resource?: Resource; id?: string; values?: Record<string, unknown> };
	if (!body.resource || !writableResources.includes(body.resource as (typeof writableResources)[number]) || !body.id || !body.values) return NextResponse.json({ error: "Invalid update request" }, { status: 400 });
	const { data, error } = await supabase!.from(body.resource).update(body.values).eq("id", body.id).select().single();
	if (error) return NextResponse.json({ error: error.message }, { status: 400 });
	return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
	const { supabase, response } = await getAdminClient();
	if (response) return response;
	const body = await request.json() as { resource?: Resource; id?: string };
	if (!body.resource || !writableResources.includes(body.resource as (typeof writableResources)[number]) || !body.id) return NextResponse.json({ error: "Invalid delete request" }, { status: 400 });
	const { error } = await supabase!.from(body.resource).delete().eq("id", body.id);
	if (error) return NextResponse.json({ error: error.message }, { status: 400 });
	return NextResponse.json({ deleted: true });
}