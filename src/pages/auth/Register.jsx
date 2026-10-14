import RegisterForm from '../../components/auth/RegisterForm.jsx';

export default function Register() {
  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="auth-card">
              <div className="mb-4">
                <span className="eyebrow text-brand">REGISTRASI WARGA</span>
                <h1 className="h3 mt-2">Buat akun warga</h1>
                <p className="text-muted">
                  Lengkapi data berikut. Semua data pada tahap ini hanya
                  diproses secara simulasi.
                </p>
              </div>
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
