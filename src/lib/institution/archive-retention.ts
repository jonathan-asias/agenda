const DEFAULT_RETENTION_DAYS = 90;

export const INSTITUTION_SNAPSHOT_VERSION = 1;

export function getInstitutionArchiveRetentionDays(): number {
  const raw = process.env.INSTITUTION_ARCHIVE_RETENTION_DAYS?.trim();
  if (!raw) return DEFAULT_RETENTION_DAYS;
  const days = Number.parseInt(raw, 10);
  return Number.isFinite(days) && days >= 1 ? days : DEFAULT_RETENTION_DAYS;
}

export function computeArchiveRetentionUntil(from: Date = new Date()): Date {
  const until = new Date(from);
  until.setDate(until.getDate() + getInstitutionArchiveRetentionDays());
  return until;
}
