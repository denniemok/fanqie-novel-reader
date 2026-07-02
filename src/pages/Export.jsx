import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
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
