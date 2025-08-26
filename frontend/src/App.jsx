import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import AppRouter from './routes/AppRouter';
import AuthProvider from './providers/AuthProvider';

function App() {
  return (
    <ConfigProvider locale={ptBR}
      theme={{ token: { colorPrimary: '#F57C00' } }}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;