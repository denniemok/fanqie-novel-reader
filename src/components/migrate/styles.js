import styled from 'styled-components';
import { Section, SectionTitle } from '../../utils/styled/sections';
import { retroTagCardStyles } from '../../utils/styled/retro';

export { Section, SectionTitle };

export const StepCard = styled.div`
  ${retroTagCardStyles}

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
