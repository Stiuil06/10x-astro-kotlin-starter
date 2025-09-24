import { AuthProvider } from './AuthContext';
import IssueReportForm from './IssueReportForm';
import { MieszkaniecOnly } from './PermissionWrapper';

export default function IssueReportFormWrapper() {
  return (
    <AuthProvider>
      <MieszkaniecOnly fallback={
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Brak uprawnień</h3>
              <p className="text-red-600 mb-4">
                Ta strona jest dostępna tylko dla użytkowników z rolą MIESZKANIEC.
              </p>
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/';
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Przejdź na stronę główną
              </button>
            </div>
          </div>
        </div>
      }>
        <IssueReportForm />
      </MieszkaniecOnly>
    </AuthProvider>
  );
}
