import { REPLACE_RULES_MAX, REPLACE_RULE_TEXT_MAX } from '../constants';

/**
 * User-defined find-and-replace rules, applied after zh conversion.
 * Rules live in IndexedDB (so backups include them); this module keeps the
 * active set in memory because maybeConvert runs synchronously during render.
 */

/** @typedef {{ from: string, to: string }} ReplaceRule */

/**
 * @param {unknown} raw
 * @returns {ReplaceRule[]} Valid rules; a later duplicate `from` replaces the earlier one and moves to the end
 */
export function normalizeReplaceRules(raw) {
  if (!Array.isArray(raw)) return [];
  const byFrom = new Map();
  for (const rule of raw) {
    const from = typeof rule?.from === 'string' ? rule.from.trim().slice(0, REPLACE_RULE_TEXT_MAX) : '';
    const to = typeof rule?.to === 'string' ? rule.to.trim().slice(0, REPLACE_RULE_TEXT_MAX) : '';
    if (!from || from === to) continue;
    byFrom.delete(from);
    byFrom.set(from, to);
  }
  return [...byFrom].slice(-REPLACE_RULES_MAX).map(([from, to]) => ({ from, to }));
}

let activePattern = null;
let activeMap = new Map();

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** @param {ReplaceRule[]} rules - Already normalized */
export function setActiveReplaceRules(rules) {
  activeMap = new Map(rules.map(({ from, to }) => [from, to]));
  // Longest first, so a longer rule wins over a shorter one sharing its start.
  const sources = [...activeMap.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp);
  activePattern = sources.length ? new RegExp(sources.join('|'), 'g') : null;
}

/** Single pass, so one rule's output is never rewritten by another rule. */
export function applyReplaceRules(text) {
  if (!activePattern || !text) return text;
  return text.replace(activePattern, (match) => activeMap.get(match) ?? match);
}
