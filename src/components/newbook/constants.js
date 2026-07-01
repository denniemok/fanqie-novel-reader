export const PRIMARY_TAB_RANK = 'rank';
export const PRIMARY_TAB_RECOMMEND = 'recommend';
export const PRIMARY_TAB_OTHERS = 'others';

export const HOMEPAGE_SECTIONS = new Set(['realtime', 'guess']);
export const RECOMMEND_CHANNELS = new Set(['male', 'female']);

export const PRIMARY_TABS = [
  { id: PRIMARY_TAB_RANK, label: '榜單' },
  { id: PRIMARY_TAB_RECOMMEND, label: '推薦' },
  { id: PRIMARY_TAB_OTHERS, label: '其他' },
];

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
  { id: 'male', label: '男生精選' },
  { id: 'female', label: '女生精選' },
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
  [PRIMARY_TAB_RANK]: '獲取榜單失敗，請稍後再試。',
  [PRIMARY_TAB_RECOMMEND]: '獲取推薦失敗，請稍後再試。',
};
