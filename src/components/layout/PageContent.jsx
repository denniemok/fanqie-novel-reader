import styled from 'styled-components';

/** Centred reading column for book detail pages (catalog, comments); matches PageContent width. */
export const TopBarOffset = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: calc(var(--topbar-height) + 32px) 24px calc(24px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 480px) {
    padding: calc(var(--topbar-height) + 16px) 16px calc(16px + env(safe-area-inset-bottom, 0px));
    gap: 12px;
  }
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  ${({ $variant }) => $variant === 'home' && 'align-items: center;'}
  padding-top: ${({ $variant }) => {
    if ($variant === 'home') return '0';
    return 'calc(var(--topbar-height) + 48px)';
  }};
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: ${({ $paddingBottom = 24 }) => $paddingBottom}px;
  ${({ $gap }) => $gap != null && `gap: ${$gap}px;`}

  @media (max-width: 480px) {
    padding-top: ${({ $variant }) => {
      if ($variant === 'home') return '0';
      return 'calc(var(--topbar-height) + 28px)';
    }};
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: ${({ $paddingBottomMobile = 16 }) => $paddingBottomMobile}px;
  }
`;

export default PageContent;
