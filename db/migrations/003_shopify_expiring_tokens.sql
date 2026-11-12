alter table shops add column if not exists refresh_token_encrypted text;
alter table shops add column if not exists access_token_expires_at timestamptz;
alter table shops add column if not exists refresh_token_expires_at timestamptz;
