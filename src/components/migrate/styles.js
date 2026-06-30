import styled from 'styled-components';
import { retroDashedCardStyles, retroTagStyles } from '../../utils/styled/retro';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--display-font-family);
  letter-spacing: 0.06em;
  color: var(--text-color);
`;

export const StepCard = styled.div`
  ${retroDashedCardStyles}
  ${retroTagStyles}

  ol {
    margin: 10px 0 0;
    padding-left: 1.25em;
  }

  li + li {
    margin-top: 8px;
  }

  p {
    margin: 8px 0 0;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 14px;
`;

export const Hint = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--text-muted, color-mix(in srgb, var(--text-color) 65%, transparent));
  line-height: 1.6;
`;

export const FileInput = styled.input`
  display: none;
`;

export const FileLabel = styled.span`
  font-size: 13px;
  color: var(--text-color);
  word-break: break-all;
`;
