import { Grid2X2, LayoutList } from 'lucide-react';
import { BtnLabel, ToggleBtn, ViewToggle } from './BookToolbarStyles';

function ListGridViewToggle({ viewMode, onViewModeChange }) {
  return (
    <ViewToggle>
      <ToggleBtn
        type="button"
        $active={viewMode === 'list'}
        onClick={() => onViewModeChange('list')}
        title="列表視圖"
        aria-label="列表視圖"
      >
        <LayoutList />
        <BtnLabel>列表</BtnLabel>
      </ToggleBtn>
      <ToggleBtn
        type="button"
        $active={viewMode === 'grid'}
        onClick={() => onViewModeChange('grid')}
        title="格狀視圖"
        aria-label="格狀視圖"
      >
        <Grid2X2 />
        <BtnLabel>格狀</BtnLabel>
      </ToggleBtn>
    </ViewToggle>
  );
}

export default ListGridViewToggle;
