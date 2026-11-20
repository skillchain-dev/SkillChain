import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import CertificateUpload from '../../features/certificates/CertificateUpload.jsx';

export default function MyCertificatesPage() {
  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Certificates" title="Your certificates" description="Upload certificates for faculty review — once approved, each one gets a shareable, blockchain-backed verification link." />
        <CertificateUpload />
      </div>
    </DashboardLayout>
  );
}
