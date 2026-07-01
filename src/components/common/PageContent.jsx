import styled from 'styled-components';

export const TopBarOffset = styled.div`
  padding-top: var(--topbar-height);
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  animation: fadeInUp 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) backwards;
  animation-delay: 0.06s;
  ${({ $variant }) => $variant === 'home' && 'align-items: center;'}
  padding-top: ${({ $variant }) => {
    if ($variant === 'home') return '0';
    return 'calc(76px + 48px + env(safe-area-inset-top))';
  }};
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: ${({ $paddingBottom = 24 }) => $paddingBottom}px;
  ${({ $gap }) => $gap != null && `gap: ${$gap}px;`}

  @media (max-width: 480px) {
    padding-top: ${({ $variant }) => {
      if ($variant === 'home') return '0';
      return 'calc(68px + 32px + env(safe-area-inset-top))';
    }};
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: ${({ $paddingBottomMobile = 16 }) => $paddingBottomMobile}px;
  }
`;

export default PageContent;
