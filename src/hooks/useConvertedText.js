import { useState, useEffect } from 'react';
import { maybeConvert } from '../utils/text/zh-convert';

/** @param {'original'|'tw'|'hk'} [mode] */
export function useConvertedText(text, mode) {
  const [converted, setConverted] = useState(text ?? '');

  useEffect(() => {
    if (!text) {
      setConverted('');
      return;
    }
    setConverted(maybeConvert(text, mode));
  }, [text, mode]);

  return converted;
}
