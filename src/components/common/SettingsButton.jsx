import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { IconButton } from './IconButton';
import SettingsModal from './SettingsModal';

function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        type="button"
        title="設定"
        aria-label="設定"
        onClick={() => setOpen(true)}
      >
        <Settings size={20} strokeWidth={2.5} />
      </IconButton>
      {open && <SettingsModal onClose={() => setOpen(false)} />}
    </>
  );
}

SettingsButton.toolLabel = '設定';

export default SettingsButton;
