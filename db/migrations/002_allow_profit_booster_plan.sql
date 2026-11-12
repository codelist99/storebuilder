alter table shops drop constraint if exists shops_selected_plan_check;

alter table shops
  add constraint shops_selected_plan_check
  check (selected_plan in ('free', 'premium_97', 'premium_47', 'profit_booster_98'));
