export function releaseYear(dateString: string | undefined | null): string {
  if (!dateString) return '—';
  const year = dateString.slice(0, 4);
  return year || '—';
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatRating(voteAverage: number | null | undefined): string {
  if (voteAverage === null || voteAverage === undefined) return '—';
  return voteAverage.toFixed(1);
}

export function ratingOutOfFive(voteAverage: number | null | undefined): number {
  if (!voteAverage) return 0;
  return Math.round((voteAverage / 2) * 2) / 2;
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
