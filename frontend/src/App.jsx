import { ConfigProvider, App as AntdApp } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import AppRouter from './routes/AppRouter';
import AuthProvider from './providers/AuthProvider';
import FeedbackProvider from './providers/FeedbackProvider';

function App() {
  return (
    <ConfigProvider locale={ptBR}
      theme={{ token: { colorPrimary: '#F57C00' } }}>
      <AntdApp>
        <FeedbackProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </FeedbackProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;