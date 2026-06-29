import styled from 'styled-components';

const STATUS_GREEN = '#4a9a4a';
const STATUS_AMBER = '#c80';
const STATUS_RED = '#d44';

export function overallStatusLabel(status) {
  if (status === 'up') return '正常';
  if (status === 'degraded') return '部分異常';
  return '離線';
}

const Badge = styled.span`
  display: inline-block;
  flex-shrink: 0;
  padding: ${({ $compact }) => ($compact ? '2px 6px' : '3px 8px')};
  border-radius: 4px;
  font-size: ${({ $compact }) => ($compact ? '10px' : '11px')};
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #fff;
  white-space: nowrap;
  background: ${({ $status }) => {
    if ($status === 'up') return STATUS_GREEN;
    if ($status === 'degraded') return STATUS_AMBER;
    return STATUS_RED;
  }};
  border: 1px solid ${({ $status }) => {
    if ($status === 'up') return STATUS_GREEN;
    if ($status === 'degraded') return STATUS_AMBER;
    return STATUS_RED;
  }};
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
