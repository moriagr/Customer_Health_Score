import { Provider } from 'react-redux';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Header } from './components/Layout/Header';
import { store } from './store';

function App() {
  return (
  <Provider store={store}>

      <Header />
      <Dashboard />
    </Provider>
  );
}

export default App;
