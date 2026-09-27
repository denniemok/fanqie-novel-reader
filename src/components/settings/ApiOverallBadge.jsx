import styled from 'styled-components';

function statusColor(status) {
  if (status === 'up') return 'var(--toast-success-color)';
  if (status === 'degraded') return 'var(--toast-warning-color)';
  return 'var(--toast-error-color)';
}

export function overallStatusLabel(status) {
  if (status === 'up') return '正常';
  if (status === 'degraded') return '部分異常';
  return '離線';
}

const Badge = styled.span`
  display: inline-block;
  flex-shrink: 0;
  padding: ${({ $compact }) => ($compact ? '4px 8px' : '2px 9px')};
  border-radius: 999px;
  font-size: ${({ $compact }) => ($compact ? '10px' : '11px')};
  font-weight: 500;
  letter-spacing: 0.06em;
  white-space: nowrap;
  color: ${({ $status }) => statusColor($status)};
  background: color-mix(in srgb, ${({ $status }) => statusColor($status)} 14%, transparent);
`;

function ApiOverallBadge({ status, compact = false }) {
  if (!status) return null;
  return (
    <Badge $status={status} $compact={compact}>
      {overallStatusLabel(status)}
    </Badge>
  );
}

export default ApiOverallBadge;
