import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, Info as InfoIcon } from 'lucide-react';
import { parseBookIdFromInput } from '../../utils/parseBookId';
import { buildCatalogUrl } from '../../utils/navigation';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: calc(76px + env(safe-area-inset-top));
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: calc(40px + env(safe-area-inset-bottom));
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding-top: calc(68px + env(safe-area-inset-top));
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
  }
`;

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
    font-family: inherit;

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

const HelpGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const HelpCard = styled.div`
  padding: 20px;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--retro-shadow);

  h3 {
    font-size: 16px;
    font-weight: 900;
    margin: 0;
    color: var(--text-color);
    text-transform: uppercase;
    font-family: inherit;
  }

  p {
    font-size: 13px;
    color: var(--text-color-secondary);
    line-height: 1.6;
    margin: 0;
    font-family: inherit;

    span {
      color: var(--accent-color);
      font-weight: 900;
    }
  }

  .code-box {
    padding: 10px 14px;
    background-color: var(--background-color);
    font-family: inherit;
    font-size: 12px;
    color: var(--text-color-secondary);
    overflow-x: auto;
    border: 1px solid var(--border-color);

    span {
      color: var(--accent-color);
      font-weight: 900;
    }
  }

  a.link-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    background-color: var(--accent-color);
    color: #000;
    font-size: 14px;
    font-weight: 900;
    text-decoration: none;
    transition: all 0.1s steps(2);
    align-self: flex-start;
    text-transform: uppercase;
    border: 2px solid #000;
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

function NewBookContent() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputElement = document.getElementById('newBookIdInput');
    const raw = inputElement.value?.trim();
    if (!raw) return;
    const bookId = parseBookIdFromInput(raw) ?? raw;
    navigate(buildCatalogUrl(bookId));
  };

  return (
    <Wrapper>
      <Section>
        <SectionTitle>
          <Search /> 開始新閱讀
        </SectionTitle>
        <InputGroup>
          <Form onSubmit={handleSubmit}>
            <input
              key={refreshKey}
              id="newBookIdInput"
              type="text"
              placeholder="貼上番茄小說書籍 ID 或 網址"
              defaultValue=""
              autoFocus
            />
            <button type="submit">開始閱讀</button>
          </Form>
        </InputGroup>
      </Section>

      <Section>
        <SectionTitle><InfoIcon /> 幫助指南</SectionTitle>
        <HelpGrid>
          <HelpCard>
            <h3>找到書籍</h3>
            <p>造訪 <span>番茄小說網</span> 找到您想閱讀的小說。</p>
            <a href="https://fanqienovel.com/library" target="_blank" rel="noopener noreferrer" className="link-button">
              前往番茄小說網
            </a>
          </HelpCard>
          <HelpCard>
            <h3>獲取書籍 ID</h3>
            <p>在小說詳情頁的網址中找到那一串數字：</p>
            <div className="code-box">
              ...fanqienovel.com/page/<span>123456789</span>?...
            </div>
          </HelpCard>
        </HelpGrid>
      </Section>
    </Wrapper>
  );
}

export default NewBookContent;
