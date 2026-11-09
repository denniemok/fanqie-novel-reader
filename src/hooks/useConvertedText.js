import { useState, useEffect } from 'react';
import { maybeConvert } from '../utils/text/zh-convert';
import { useReplaceRules } from './useConversionMode';

/** @param {'original'|'tw'|'hk'} [mode] */
export function useConvertedText(text, mode) {
  const [converted, setConverted] = useState(text ?? '');
  const { replaceRulesRevision } = useReplaceRules();

  useEffect(() => {
    if (!text) {
      setConverted('');
      return;
    }
    setConverted(maybeConvert(text, mode));
  }, [text, mode, replaceRulesRevision]);

  return converted;
}
