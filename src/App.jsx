import { useEffect, useState } from 'react';
import './App.css'
import FacePanel from './components/face-panel'
import axios from "axios";

function App() {
  const [token, setToken] = useState('')
  const getToken = async () => {
    try {
      const data = { "username": import.meta.env.VITE_USER, "password": import.meta.env.VITE_PASWORD }
      const res = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_API_KEY}/token`,
        data
      })
      const tokenAccess = res.data.access
      console.log(tokenAccess);

      setToken(tokenAccess)
    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    getToken()
  }, [])

  const handler=(res)=>{
    console.log('respon', res);
    
  }
  return (
    <>
      <div className='w-[80%] '>
        {
          token && <FacePanel token={token} handler={handler} title="Reconocimiento Facial"></FacePanel>
        }

      </div>
    </>
  )
}

export default App
