import axios from "axios";

import { useRef, useCallback, useState, useEffect } from "react"
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user"
};
import loadingGift from '../assets/loading.gif'

const FacePanel = ({ title , token, urlParam='', handler}) => {
    const [url, setUrl] = useState('')
    
    useEffect(() => {
       
        if (!token) {
            throw new Error("Token is required")
        }
    }, [])
    
    useEffect(() => {
       
        setUrl(`${import.meta.env.VITE_API_KEY}/faces/recognition-knn`)
      
       
    }, [urlParam, url])
    
    const webcamRef = useRef(null);
    const [loading, setLoading] = useState()

    const capture = useCallback(
        async () => {
            setLoading(true)

            const imageSrc = webcamRef.current.getScreenshot();
            console.log(imageSrc);
            const fd = new FormData()
            try {
              
                let face
                await fetch(imageSrc)
                    .then(res => res.blob())
                    .then(img => face = img)
    
                fd.append('face', face, 'image.png');
                const res = await axios({
                    method: 'POST',
                    url: url,
                    data: fd,
                    headers : { Authorization: `Bearer ${token}` }
                })

                const response={
                    response:true,
                    user:res.data.user
                }
                
                handler(response)
                withReactContent(Swal).fire({
                    title: <i>Bienvenido {res.data.user.nombre}</i>,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 3500
                })
            } catch (error) {
                console.error(error);
                const response={
                    response:false,
                    user:null
                }

                handler(response)
                if (error.response.code==401) {
                    withReactContent(Swal).fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Autenticación inválida 401",
                        timer: 2500
    
                    })
                }
                withReactContent(Swal).fire({
                    icon: "error",
                    title: "Rostro desconocido",
                    text: "No se pudo reconocer el rostro. Asegúrese de que su rostro esté bien iluminado y completamente visible, luego intente de nuevo",
                    timer: 4500

                })
            } finally{
                setLoading(false)
            }

        },
        [webcamRef]
    );
    return <section className="rounded-3xl px-6 py-6 w-full h-full bg-slate-900">

        <div className="rounded-xl bg-slate-600 w-full  relative flex justify-center items-center">
            {/* {title && <h3 className="text-2xl text-left ml-4" >{title}</h3>} */}
            {
                loading && <figure className="w-full h-full absolute top-0 left-0">
                    <img  className="w-full h-full object-cover " src={loadingGift} alt="loading..." />
                </figure>
            }
            <button onClick={capture}
                className="rounded-lg opacity-65 px-4 py-2 bg-slate-800 text-white
                     absolute top-1  left-4 flex gap-3 justify-center items-center">
                <i className='bx bx-camera-movie'></i> </button>

            <div className="absolute w-1/2 h-1/2 " >
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
            </div>
            <Webcam
                style={{ borderRadius: "20px" }}
                className=" bg-white w-full h-full "
                audio={false}
                width={"100%"}
                screenshotFormat="image/jpeg"
                ref={webcamRef}
                videoConstraints={videoConstraints}
            >

            </Webcam>

            <button onClick={capture}
                className="rounded-lg opacity-65 px-6 py-4 bg-slate-800 text-white
                     absolute bottom-1   flex gap-3 justify-center items-center">
                <i className='bx bxs-camera bx-sm'></i> </button>
        </div>

    </section>

};

export default FacePanel;
