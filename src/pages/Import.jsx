import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
import ImportContent from '../components/migrate/ImportContent';

function Import() {
  return (
    <NavPageLayout>
      <NavTopBar pageTitle="匯入資料" />
      <ImportContent />
    </NavPageLayout>
  );
}

export default Import;
