import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { parseBookIdFromInput } from '../../utils/parseBookId';
import { buildCatalogUrl } from '../../utils/navigation';
import Section from './Section';

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  box-sizing: border-box;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  width: 100%;
  box-shadow: var(--retro-shadow);
`;

const FormEl = styled.form`
  display: flex;
  gap: 12px;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  input {
    flex: 1;
    padding: 14px 20px;
    background-color: var(--background-color);
    border: var(--retro-border-width) solid var(--border-color);
    border-radius: var(--border-radius-sm);
    color: var(--text-color);
    font-size: 16px;
    transition: var(--transition-default);
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }

    &::placeholder {
      color: var(--text-color-secondary);
      opacity: 0.5;
    }
  }

  button {
    padding: 10px 28px;
    background-color: var(--accent-color);
    color: var(--text-on-accent);
    border: var(--retro-border-width) solid var(--accent-color);
    border-radius: var(--border-radius-sketch);
    font-size: 16px;
    font-weight: 600;
    font-family: var(--display-font-family);
    cursor: pointer;
    transition: var(--transition-default);
    white-space: nowrap;
    box-shadow: var(--retro-shadow);
    letter-spacing: 0.06em;

    &:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px) rotate(-0.5deg);
      box-shadow: var(--retro-shadow-hover);
    }

    &:active {
      transform: translate(1px, 1px);
      box-shadow: none;
    }
  }
`;

function Form({ embedded = false, autoFocus = false }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = inputRef.current?.value?.trim();
    if (!raw) return;
    const bookId = parseBookIdFromInput(raw) ?? raw;
    navigate(buildCatalogUrl(bookId));
  };

  const content = (
    <InputGroup>
      <FormEl onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="貼上書籍 ID 或網址（番茄小說 / Tomato MTL）"
          defaultValue=""
          autoFocus={autoFocus}
        />
        <button type="submit">開始閱讀</button>
      </FormEl>
    </InputGroup>
  );

  return embedded ? content : <Section>{content}</Section>;
}

export default Form;
