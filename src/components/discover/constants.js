export const PRIMARY_TAB_SEARCH = 'search';
export const PRIMARY_TAB_RANK = 'rank';
export const PRIMARY_TAB_RECOMMEND = 'recommend';
export const PRIMARY_TAB_OTHERS = 'others';

export const HOMEPAGE_SECTIONS = new Set(['realtime', 'guess']);

export const PRIMARY_TABS = [
  { id: PRIMARY_TAB_SEARCH, label: '搜尋' },
  { id: PRIMARY_TAB_RANK, label: '榜單' },
  { id: PRIMARY_TAB_RECOMMEND, label: '推薦' },
  { id: PRIMARY_TAB_OTHERS, label: '其他' },
];

export const PRIMARY_TAB_IDS = new Set(PRIMARY_TABS.map((tab) => tab.id));

export const RANK_SECONDARY_TABS = [
  { id: 'recommend', label: '推薦榜' },
  { id: 'finished', label: '完本榜' },
  { id: 'new', label: '新書榜' },
  { id: 'chasing', label: '追更榜' },
  { id: 'darkhorse', label: '黑馬榜' },
  { id: 'peak', label: '巔峰榜' },
  { id: 'reading', label: '閱讀榜' },
];

export const RECOMMEND_SECONDARY_TABS = [
  { id: 'realtime', label: '即時熱度' },
  { id: 'guess', label: '猜你喜歡' },
];

export const SECONDARY_TABS_BY_PRIMARY = {
  [PRIMARY_TAB_RANK]: RANK_SECONDARY_TABS,
  [PRIMARY_TAB_RECOMMEND]: RECOMMEND_SECONDARY_TABS,
};

export const DEFAULT_SECONDARY_BY_PRIMARY = {
  [PRIMARY_TAB_RANK]: 'recommend',
  [PRIMARY_TAB_RECOMMEND]: 'realtime',
};

export const PRIMARY_ERROR_MESSAGES = {
  [PRIMARY_TAB_SEARCH]: '搜尋失敗，請稍後再試。',
  [PRIMARY_TAB_RANK]: '獲取榜單失敗，請稍後再試。',
  [PRIMARY_TAB_RECOMMEND]: '獲取推薦失敗，請稍後再試。',
};

export function resolveDiscoverRoute(tab, section) {
  const fallback = {
    activePrimary: PRIMARY_TAB_SEARCH,
    activeSecondary: null,
    secondaryTabs: [],
    redirectTab: PRIMARY_TAB_SEARCH,
    redirectSection: null,
  };

  if (!tab || !PRIMARY_TAB_IDS.has(tab)) {
    return fallback;
  }

  const activePrimary = tab;
  const secondaryTabs = SECONDARY_TABS_BY_PRIMARY[activePrimary] ?? [];
  const defaultSecondary = DEFAULT_SECONDARY_BY_PRIMARY[activePrimary];
  const hasSectionTab = activePrimary === PRIMARY_TAB_RANK || activePrimary === PRIMARY_TAB_RECOMMEND;

  if (section && !hasSectionTab) {
    return {
      activePrimary,
      activeSecondary: null,
      secondaryTabs,
      redirectTab: activePrimary,
      redirectSection: null,
    };
  }

  if (hasSectionTab && (!section || !secondaryTabs.some((t) => t.id === section))) {
    return {
      activePrimary,
      activeSecondary: defaultSecondary,
      secondaryTabs,
      redirectTab: activePrimary,
      redirectSection: defaultSecondary,
    };
  }

  return {
    activePrimary,
    activeSecondary: section ?? defaultSecondary,
    secondaryTabs,
    redirectTab: null,
    redirectSection: null,
  };
}
