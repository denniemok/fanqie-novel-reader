import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  getConversionMode,
  setConversionMode as persistConversionMode,
  getReplaceRules,
  saveReplaceRules,
} from '../utils/storage';
import { normalizeReplaceRules, setActiveReplaceRules } from '../utils/text/replaceRules';

const ConversionModeContext = createContext(null);

const NO_REPLACE_RULES = {
  replaceRules: [],
  replaceRulesRevision: 0,
  setReplaceRules: async () => false,
  reloadReplaceRules: async () => {},
};

export function ConversionModeProvider({ children }) {
  const [conversionMode, setModeState] = useState(() => getConversionMode());
  const [replaceRules, setRulesState] = useState([]);
  // Bumped whenever the active rules change, so memoized conversions can recompute.
  const [replaceRulesRevision, setReplaceRulesRevision] = useState(0);
  // Latest rules, so back-to-back edits build on each other instead of a stale render.
  const rulesRef = useRef([]);

  const setConversionMode = useCallback((newMode) => {
    if (newMode !== 'original' && newMode !== 'tw' && newMode !== 'hk') return;
    persistConversionMode(newMode);
    setModeState(newMode);
  }, []);

  const activateRules = useCallback((rules) => {
    rulesRef.current = rules;
    setActiveReplaceRules(rules);
    setRulesState(rules);
    setReplaceRulesRevision((n) => n + 1);
  }, []);

  const reloadReplaceRules = useCallback(async () => {
    activateRules(await getReplaceRules());
  }, [activateRules]);

  /**
   * @typedef {import('../utils/text/replaceRules').ReplaceRule} ReplaceRule
   * @param {ReplaceRule[] | ((current: ReplaceRule[]) => ReplaceRule[])} rulesOrUpdater
   * @returns {Promise<boolean>} false when the rules could not be saved
   */
  const setReplaceRules = useCallback(async (rulesOrUpdater) => {
    const rules = typeof rulesOrUpdater === 'function' ? rulesOrUpdater(rulesRef.current) : rulesOrUpdater;
    const normalized = normalizeReplaceRules(rules);
    rulesRef.current = normalized;
    try {
      await saveReplaceRules(normalized);
    } catch {
      await reloadReplaceRules(); // Resync with what is actually stored
      return false;
    }
    activateRules(normalized);
    return true;
  }, [activateRules, reloadReplaceRules]);

  useEffect(() => {
    reloadReplaceRules();
  }, [reloadReplaceRules]);

  return (
    <ConversionModeContext.Provider
      value={{
        conversionMode,
        setConversionMode,
        replaceRules,
        replaceRulesRevision,
        setReplaceRules,
        reloadReplaceRules,
      }}
    >
      {children}
    </ConversionModeContext.Provider>
  );
}

export function useConversionMode() {
  const ctx = useContext(ConversionModeContext);
  if (!ctx) {
    return [getConversionMode(), () => {}];
  }
  return [ctx.conversionMode, ctx.setConversionMode];
}

/** User replace rules applied after conversion; see utils/text/replaceRules. */
export function useReplaceRules() {
  return useContext(ConversionModeContext) ?? NO_REPLACE_RULES;
}
