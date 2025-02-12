import logo from './logo.svg';
import './App.css';
import Navigation from './components/navigation';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import DoctorForm from './pages/doctorForm';
import ClientForm from './pages/clientForm';
import ClientUpload from './pages/clientUpload';
import DoctorDownload from './pages/doctorDownload';

function App() {
  return (
     <div className="App">
      <Routes>
    <Route path="/" element={ <Home  />} />
    <Route path="/doctorForm" element={ <DoctorForm  />} />
    <Route path="/clientForm" element={ <ClientForm  />} />
    <Route path="/clientUpload" element={ <ClientUpload  />} />
    <Route path="/doctorDownload" element={ <DoctorDownload  />} />
 </Routes>
    </div>
  );
}

export default App;