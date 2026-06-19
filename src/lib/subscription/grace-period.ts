const DEFAULT_GRACE_DAYS = 7;

export function getSubscriptionGraceDays(): number {
  const raw = process.env.SUBSCRIPTION_GRACE_DAYS?.trim();
  if (!raw) return DEFAULT_GRACE_DAYS;
  const days = Number.parseInt(raw, 10);
  return Number.isFinite(days) && days >= 0 ? days : DEFAULT_GRACE_DAYS;
}

export function addGraceDays(from: Date = new Date()): Date {
  const end = new Date(from);
  end.setDate(end.getDate() + getSubscriptionGraceDays());
  return end;
}
