import { useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';


// @mui
import { 
    Box,
    Button,
    CircularProgress,
    Paper,
    Chip,
    Fab
 } from '@mui/material';

// Iconos
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from '@mui/icons-material/Close';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';

 // Axios
import axios from 'axios';
import UserContext from "../../context/AuthContext";

ImageUpload.propTypes = {
  updateState:PropTypes.func,
  imageData:PropTypes.object
};

function ImageUpload({updateState,dark,height,recomend,imageData, textButton,...other}) {

    const [dataImage,setDataImage] = useState();
    const [loading,setLoading] = useState(false);
    const { jwt  } = useContext(UserContext);

    const changeScreen  = (e)=>{
        setLoading(true);
        axios.post(`https://api.lessin.pe/wp-json/wp/v2/media`,e.target.files[0],
        {

            headers:{
                'Authorization': 'Bearer '+ jwt,
                'Content-Type': e.target.files[0].type,
                'Content-Disposition': `form-data; filename=${e.target.files[0].name}`
            }
        }).then((resp)=>{
            setLoading(false);
            setDataImage({
                image:resp.data.guid.rendered,
                name:e.target.files[0].name
            })
            updateState({
                image:resp.data.guid.rendered,
                name:e.target.files[0].name
            });
        }).catch((error)=>{
          console.log(error)
        })
    }

    const removeImage = () =>{
        setDataImage(null);
    }
    
    useEffect(()=>{
        if(imageData){
            setDataImage(imageData)
        }else{
            setDataImage();
        }
    },[imageData])

    return (
      <Box >
        {recomend &&
            <Chip label={recomend} sx={{width:'100%',mb:1}} />
        }
        <Paper elevation={3} sx={{
            background:dark ?'#5c6777':'#fff',
            height:height?height:'200px',
            padding:'10px',display:'flex',
            alignItems:'center',
            position:'relative',
            overflow:'hidden',
            flexDirection:'column',
            justifyContent: 'center'}} 
            {...other} 
            variant={dark ? '' :'outlined'}
        >
            {loading &&
                <CircularProgress sx={{position:'absolute',top:'0px',left:'0px',bottom:'0px',right:'0px',margin:'auto'}} />
            }
            {!dataImage ?
                <InsertPhotoOutlinedIcon sx={{
                    width:'100px',
                    height:'100px',
                    fill:dark ?'#fff':'#5c6777',
                    opacity:loading ? 0.2: 0.6,
                    mb:'10px'
                }} />
            :
                <img src={dataImage.image} />
            }

            {!dataImage ?
                <Button
                    component="label"
                    fullWidth
                    variant="contained"
                    className='btnUpload'
                    startIcon={<UploadFileIcon />}
                    disabled={loading}
                >
                    {textButton ? textButton : 'Logo'}
                    <input 
                    type="file" 
                    name="imagenPreview"
                    id="imagenPreview"
                    accept=".png,.jpg,.gif" 
                    hidden 
                    value={null}
                    onChange={changeScreen} 
                    />
                </Button>
            :
                <Fab color="primary"  size="small" aria-label="add" onClick={removeImage} sx={{position:'absolute',top:'5px',right:'5px'}}>
                    <CloseIcon />
                </Fab>
            }
        </Paper>
      </Box>
    );

}

export default ImageUpload;
