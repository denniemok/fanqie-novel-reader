import styled from 'styled-components';
import { catalogInsetBarSurface, catalogPanelShell } from '../../utils/styled/retro';

const Panel = styled.section`
  margin: 12px 6px;
  ${catalogPanelShell}
`;

const Bar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px 16px;
  padding: 12px 16px;
  ${catalogInsetBarSurface}

  @media (max-width: 480px) {
    padding: 12px 12px;
    gap: 2px 10px;
  }
`;

function BookActionBar({ children }) {
  return (
    <Panel>
      <Bar>{children}</Bar>
    </Panel>
  );
}

export default BookActionBar;
