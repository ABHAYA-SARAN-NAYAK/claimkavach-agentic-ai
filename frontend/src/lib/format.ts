export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  return formatter.format(amount || 0);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return dateStr;
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getAgentColor(agent: string): string {
  switch (agent.toLowerCase()) {
    case 'lekha':
      return '#1F4D3A'; // Evergreen
    case 'nyaya':
      return '#B8472A'; // Clay
    case 'doot':
      return '#3B6EA5'; // Info blue
    case 'rakshak':
      return '#2F8F5B'; // Guardian green
    default:
      return '#768579'; // Sage
  }
}

export function getVerdictBadgeClass(verdict: string): { bg: string; text: string; border: string; label: string } {
  switch (verdict?.toLowerCase()) {
    case 'strong_case':
      return {
        bg: 'bg-[#EAF6EE] dark:bg-[#1C3626]',
        text: 'text-[#1B6A40] dark:text-[#6AD39A]',
        border: 'border-[#CDE8D5] dark:border-[#2C523A]',
        label: 'Strong Case',
      };
    case 'possible':
    case 'challengeable':
      return {
        bg: 'bg-[#FCF2E7] dark:bg-[#342416]',
        text: 'text-[#995412] dark:text-[#FBBF7A]',
        border: 'border-[#F5DAC0] dark:border-[#523A25]',
        label: 'Challengeable',
      };
    case 'valid_deduction':
      return {
        bg: 'bg-[#EEF2EF] dark:bg-[#202923]',
        text: 'text-[#4A574E] dark:text-[#A1B0A6]',
        border: 'border-[#D9E1DC] dark:border-[#334237]',
        label: 'Valid Deduction',
      };
    case 'need_more_info':
    case 'need_information':
    default:
      return {
        bg: 'bg-[#F3F4F3] dark:bg-[#222724]',
        text: 'text-[#5A635D] dark:text-[#9EA8A1]',
        border: 'border-[#E0E4E1] dark:border-[#38403A]',
        label: 'Need Information',
      };
  }
}
