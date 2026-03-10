import React from 'react';
import styled from 'styled-components';
import { Search, Globe, Languages } from 'lucide-react';
import { API_OPTIONS, ZH_CONVERSION_OPTIONS } from '../../utils/constants';
import { useApiBase } from '../../hooks/useApiBase';
import { useConversionMode } from '../../hooks/useConversionMode';
import { parseBookIdFromInput } from '../../utils/parseBookId';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--background-color2);
  padding: 7px 12px;
  border: 1px solid var(--border-color);
  width: fit-content;
  box-shadow: 2px 2px 0px var(--background-color);

  svg {
    width: 16px;
    height: 16px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  box-sizing: border-box;
  background-color: var(--background-color2);
  border-radius: 0;
  border: var(--retro-border-width) solid var(--border-color);
  width: 100%;
  box-shadow: var(--retro-shadow);
`;

const Form = styled.form`
  display: flex;
  gap: 12px;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  input {
    flex: 1;
    padding: 14px 20px;
    border-radius: 0;
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    font-size: 16px;
    transition: all 0.1s steps(2);
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(143, 163, 143, 0.2);
    }

    &::placeholder {
      color: var(--text-color-secondary);
      opacity: 0.5;
    }
  }

  button {
    padding: 8px 28px;
    margin: 0;
    border-radius: 0;
    background-color: var(--accent-color);
    color: #000;
    border: 2px solid #000;
    font-size: 16px;
    font-weight: 900;
    cursor: pointer;
    transition: all 0.1s steps(2);
    white-space: nowrap;
    text-transform: uppercase;
    box-shadow: 4px 4px 0px #000;

    &:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px #000;
    }

    &:active {
      transform: translate(1px, 1px);
      box-shadow: 0px 0px 0px #000;
    }
  }
`;

const ApiSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-color);
  flex-wrap: wrap;
  font-family: inherit;

  select {
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    color: var(--accent-color);
    font-weight: 900;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 0;
    transition: all 0.1s steps(2);

    &:hover {
      background-color: var(--hover-background-color);
    }

    &:focus {
      outline: none;
    }
  }
`;

function AddBook({ onSubmit, refreshKey, conversionMode, onConversionModeChange }) {
  const [apiBase, handleApiChange] = useApiBase();
  const [localConversionMode, setLocalConversionMode] = useConversionMode();
  const isControlled = conversionMode !== undefined && onConversionModeChange !== undefined;
  const effectiveConversionMode = isControlled ? conversionMode : localConversionMode;
  const handleConversionChange = isControlled ? onConversionModeChange : setLocalConversionMode;

  const handleSelectChange = (e) => {
    handleApiChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputElement = document.getElementById('bookIdInput');
    const raw = inputElement.value?.trim();
    if (!raw || !onSubmit) return;
    const bookId = parseBookIdFromInput(raw) ?? raw;
    onSubmit(bookId);
  };

  return (
    <Section>
      <SectionTitle><Search /> 開始新閱讀</SectionTitle>
      <InputGroup>
        <Form onSubmit={handleSubmit}>
          <input
            key={refreshKey}
            id="bookIdInput"
            type="text"
            placeholder="貼上書籍 ID 或 網址"
            defaultValue=""
          />
          <button type="submit">開始閱讀</button>
        </Form>
        <ApiSelectWrapper>
          <Globe size={14} />
          <span>API 服務:</span>
          <select id="apiSelect" value={apiBase} onChange={handleSelectChange}>
            {API_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Languages size={14} />
          <span>繁簡:</span>
          <select
            value={effectiveConversionMode}
            onChange={(e) => handleConversionChange(e.target.value)}
            title="繁簡轉換"
          >
            {ZH_CONVERSION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </ApiSelectWrapper>
      </InputGroup>
    </Section>
  );
}

export default AddBook;
