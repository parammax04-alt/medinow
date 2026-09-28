create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin');
$$;

create policy "Admins manage pharmacies" on public.pharmacies for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage medicines" on public.medicines for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage inventory" on public.inventory for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins view users" on public.users for select using (public.is_admin());
create policy "Admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins view order items" on public.order_items for select using (public.is_admin());
create policy "Admins manage prescriptions" on public.prescriptions for all using (public.is_admin()) with check (public.is_admin());