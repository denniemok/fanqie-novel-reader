import styled from 'styled-components';

export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  align-items: stretch;

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

export const ListLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
