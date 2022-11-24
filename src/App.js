import './App.css';
import { AppProvider } from '../src/Context/AppContext'
import ShowTodo from './components/ShowTodo';
import { ToastContainer, toast } from 'react-toastify';

function App() {

  return (
    <div
      className='App'
    >
      <AppProvider>
        <ShowTodo />
        <ToastContainer />
      </AppProvider>

    </div>
  );
}

export default App;
