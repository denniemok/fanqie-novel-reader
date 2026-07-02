import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
import ExportContent from '../components/migrate/ExportContent';

function Export() {
  return (
    <NavPageLayout>
      <NavTopBar pageTitle="匯出資料" />
      <ExportContent />
    </NavPageLayout>
  );
}

export default Export;
