import logo from './logo.svg';
import './App.css';
import { supabase } from './API/SupabaseAPI';

function App() {

  async function fetchA() {
    const { data, error } = await supabase.from('a').select('*');
    
    if (error) {
      console.error('Error al obtener datos:', error);
      return;
    }

    data.forEach(a => {
      console.log(a); 
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={fetchA}>Boton</button>
      </header>
    </div>
  );
}

export default App;
