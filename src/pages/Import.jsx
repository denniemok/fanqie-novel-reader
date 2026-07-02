import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
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
