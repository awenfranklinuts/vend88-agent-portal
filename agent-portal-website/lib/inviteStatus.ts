// How a pending invite reads on screen. The backend reports the live token's
// expiry, or marks the invite expired when no live token remains - its rows are
// dropped by a TTL shortly after they lapse, so "no token" and "expired" are the
// same thing from here.
export type InviteFields = {
  invite_pending?: boolean;
  invite_expires_at?: string | null;
  invite_expired?: boolean;
};

export function inviteDaysLeft(expiresAt?: string | null): number | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function inviteLabel(
  item: InviteFields,
  t: (k: "inviteExpired" | "inviteExpiresIn" | "inviteExpiresToday" | "days") => string,
): string | null {
  if (!item.invite_pending && item.invite_expired === undefined) return null;
  if (item.invite_expired) return t("inviteExpired");
  const days = inviteDaysLeft(item.invite_expires_at);
  if (days === null) return null;
  if (days <= 1) return t("inviteExpiresToday");
  return `${t("inviteExpiresIn")} ${days} ${t("days")}`;
}
