import { fetchHomepageBookList, fetchRankBookList } from './api';
import {
  HOMEPAGE_SECTIONS,
  PRIMARY_TAB_RANK,
  PRIMARY_TAB_RECOMMEND,
} from '../components/discover/constants';

export function fetchDiscoverList(primaryId, secondaryId, { signal } = {}) {
  if (primaryId === PRIMARY_TAB_RECOMMEND) {
    if (HOMEPAGE_SECTIONS.has(secondaryId)) {
      return fetchHomepageBookList(secondaryId, { signal });
    }
    return Promise.resolve([]);
  }

  if (primaryId === PRIMARY_TAB_RANK) {
    return fetchRankBookList(secondaryId, { signal });
  }

  return Promise.resolve([]);
}
