import LoginForm from '../../components/auth/LoginForm.jsx';

export default function Login() {
  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="auth-card">
              <div className="text-center mb-4">
                <img
                  src="/assets/placeholders/logo-kelurahan.png"
                  className="auth-logo"
                  alt="Logo Kelurahan Betet"
                />
                <h1 className="h3 mt-3">Masuk ke Portal Warga</h1>
                <p className="text-muted">
                  Gunakan NIK atau email untuk melanjutkan.
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
