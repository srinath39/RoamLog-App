import React, { useRef ,useState, useEffect} from 'react';
import Button from './Button';
import './ImageUpload.css';


const ImageUpload= props=>{
    const [files,setFiles] =useState();
    const [isValid,setIsValid] =useState();
    const [previewUrl, setPreviewUrl]=useState();

    const filePickerRef=useRef();
    const pickImageHandler=()=>{
        filePickerRef.current.click();
    }
    const pickedImage=event =>{
        let pickedFile;
        let fileValid=isValid;
        if(event.target.files && event.target.files.length===1)
        {
            pickedFile=event.target.files[0];
            setFiles(pickedFile);
            setIsValid(true);
            fileValid=true;
        }
        else{
            setIsValid(false);
            fileValid=false;
        }
        props.onInput(props.id, pickedFile, fileValid);
    }

    useEffect(()=>{
        if(!files)
        {
            return;
        }
        const fileReader=new FileReader();
        fileReader.onload=()=>{
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(files);
    },[files]);


    return <>
        <div className='form-control'>
            <input id={props.id} style={{display:'none'}} type='file' accept='.jpeg,.jpg,.png' ref={filePickerRef} onChange={pickedImage}/>
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl && <img src={previewUrl} alt="preview" /> }
                    {!previewUrl && <p>Please pick an Image</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p> {props.errorText}</p>}
        </div>
    </>
}

export default ImageUpload;