import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// @mui
import { 
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    LinearProgress
} from '@mui/material';

// Stylos
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius:3,
    p: 4,
};

// Components
import SecIntroHome from './sections/intro';
import SecMarcaHome from './sections/Marcas';

 // Axios
import axios from 'axios';
import SecExitoHome from './sections/Exito';
import SecCursoHome from './sections/Cursos';
import SecBussinesHome from './sections/ForBusiness';
import SecBanerHome from './sections/Baner';
import SecDocenteHome from './sections/Docentes';
import SecContactoHome from './sections/Contacto';


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

HomePage.propTypes = {
    updateState:PropTypes.func,
    dataState:PropTypes.object
};


function HomePage({updateState, dataState, ...other}) {

    const [value, setValue] = useState(0);
    const [loading,setLoading] = useState(false);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(()=>{

    },[])

    return (
        <>
            {loading && <LinearProgress /> }
            <Paper variant='outlined' sx={{ width: '100%' }}  className={loading && 'disabledBlock'}>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Intro" {...a11yProps(0)} />
                        <Tab label="Marcas" {...a11yProps(1)} />
                        <Tab label="Exito" {...a11yProps(2)} />
                        <Tab label="Cursos" {...a11yProps(3)} />
                        <Tab label="For business" {...a11yProps(4)} />
                        <Tab label="Baner" {...a11yProps(5)} />
                        <Tab label="Docentes" {...a11yProps(6)} />
                        <Tab label="Contacto" {...a11yProps(7)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <SecIntroHome updateState={setLoading}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <SecMarcaHome updateState={setLoading}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <SecExitoHome updateState={setLoading}/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                    <SecCursoHome  updateState={setLoading} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={4}>
                    <SecBussinesHome  updateState={setLoading} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={5}>
                    <SecBanerHome  updateState={setLoading} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={6}>
                    <SecDocenteHome  updateState={setLoading} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={7}>
                    <SecContactoHome  updateState={setLoading} />
                </CustomTabPanel>
            </Paper>
        </>

    );

}

export default HomePage;