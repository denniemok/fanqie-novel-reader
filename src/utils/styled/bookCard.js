import { css } from 'styled-components';

/**
 * Flat book-card surface shared by bookshelf and discover cards.
 * Pass $still to suppress hover feedback (reorder / drag modes).
 */
export const bookCardSurface = css`
  background: var(--card-surface);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition-default);

  @media (hover: hover) {
    &:hover {
      border-color: ${(p) => (p.$still ? 'var(--border-color)' : 'var(--border-strong)')};
      background: ${(p) => (p.$still ? 'var(--card-surface)' : 'var(--surface-raised)')};
    }
  }
`;

/** Cover image zoom on card hover (applied to the card). */
export const bookCardCoverZoom = css`
  @media (hover: hover) {
    &:hover img {
      transform: ${(p) => (p.$still ? 'none' : 'scale(1.03)')};
    }
  }
`;

export const bookCoverImage = css`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  background-color: var(--cover-bg);
  display: block;
  transition: transform 0.5s var(--ease-out);
`;

/** Small translucent label laid over a cover image; legible in both themes. */
export const coverMetaBadge = css`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(20, 18, 16, 0.58);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
`;

export const bookCardTitle = css`
  font-size: 14px;
  font-weight: 600;
  font-family: var(--display-font-family);
  letter-spacing: 0.02em;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.45;
  min-height: calc(14px * 1.45 * 2);
`;

export const bookCardAuthor = css`
  font-size: 12px;
  color: var(--text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-height: 12px;
`;
