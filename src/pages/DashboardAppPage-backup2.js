import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { 
  Grid, 
  Container, 
  Typography, 
  Card, 
  CardHeader, 
  Box, 
  CardContent,
  Button
} from '@mui/material';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// Date range
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { CSVLink } from "react-csv";

// components
import Iconify from '../components/iconify';
import GetAppIcon from '@mui/icons-material/GetApp';
import SearchIcon from '@mui/icons-material/Search';

// sections
import {
  AppCurrentVisits,
  AppWidgetSummary,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import AppCurrentVisitsPlatform from 'src/sections/@dashboard/app/AppCurrentVisitsPlatform';
import AppNoGraphics from 'src/sections/@dashboard/app/AppNoGraphics';
import AppHours from 'src/sections/@dashboard/app/AppHours';
import AppCurrentVisitsPlatform2 from 'src/sections/@dashboard/app/AppCurrentVisitsPlatform2';

import UserContext from "../context/AuthContext";

import userIco from '../assets/image/ico_user.png';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const { idCli,idCli2,jwt  } = useContext(UserContext);

  const [userList,setUserList] = useState(null);
  const [clientsList,setClientsList] = useState(null);
  const [clientSelect,setClientSelect] = useState(0);
  const [clientVisit,setClientVisit] = useState(null);
  const [rangeSelect,setRangeSelect] = useState({
    ini:'2022/01/01',
    end:'2030/12/31'
  });

  const [activeUser,setActiveUser] = useState(0);

  const [timeStudi,setTimeStudi] = useState(0);
  const [coursesCompletes,setCoursesCompletes] = useState();
  const [coursesTotal,setCoursesTotal] = useState();
  const [rankinCourseLists,setRankingCoursesList] = useState([]);
  const [dataCsv,setDataCsv] = useState(null);

  const [promProgress,setPromProgress] = useState(0);

  const handleChangeSelect = (e) =>{
    setClientSelect(e.target.value)
  }


  const getAllClient = () =>{
    axios.get('https://api.lessin.pe/wp-json/wp/v2/clientes')
    .then((resp)=>{
      setClientsList(resp.data)
    })
  }

  const getAllUser = (client) =>{
    if( client === 0 ){
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/clienteDash')
      .then((resp)=>{
        setUserList(resp.data[0]);
      }).then((errr)=>{
        console.log(errr)
      })
    }else{
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/clienteDash',{
        forcompany:client
      })
      .then((resp)=>{
        setUserList(resp.data[0])
      }).then((errr)=>{
        console.log(errr)
      })
    }
  }

  const getAllVisit = (client,ini,end)=>{
    if( client === 0 ){
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/clienteDashVisit',{
        forcompany_ini:ini,
        forcompany_end:end
      })
      .then((resp)=>{
        setClientVisit(resp.data)
      }).then((errr)=>{
        console.log(errr)
      })
    }else{
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/clienteDashVisit',{
        forcompany:client,
        forcompany_ini:ini,
        forcompany_end:end
      })
      .then((resp)=>{
        setClientVisit(resp.data)
      }).then((errr)=>{
        console.log(errr)
      })
    }
  }

  const getActiveUser = (company,ini,end)=>{

    var timeXCourse = 0;
    var promediProgess = 0;
    let courseIncomplets = 0;
    let coursesTotalTmp = 0;


    if(company === 0){
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/courseVideoDashboard',{
        forcompany_ini:ini,
        forcompany_end:end
      }).then((resp)=>{


        const ids = resp.data.map(({ user_id }) => user_id);
        const filtered = resp.data.filter(({ user_id }, index) => !ids.includes(user_id, index + 1));

        const ids2 = resp.data.map(({ id }) => id);
        const filtered2 = resp.data.filter(({ id }, index) => !ids2.includes(id, index + 1));

        let rankingCourses = [];
        let csvTemp = [];
        filtered2.map((filtItem)=>{
          if(filtItem.course_state === "1"){
            courseIncomplets = courseIncomplets + 1;
          }
          coursesTotalTmp = coursesTotalTmp + 1;
          let companyName = "";
          if(clientsList){
            clientsList.map((cliItem)=>{
              
              if(parseInt(filtItem.course_company) === parseInt(cliItem.id)){
                companyName = cliItem.title.rendered;
                console.log(cliItem.id)
              }
            })
          }
          const dateTmp = new Date(filtItem.date_reg);  // 2009-11-10
          const monthTmp = dateTmp.toLocaleString('default', { month: 'long' });

          const timeFormated = new Date(null);
          timeFormated.setSeconds(parseInt(filtItem.course_time));

          csvTemp.push({
            client:companyName,
            mes:monthTmp,
            fecha_inicio_curso:filtItem.date_reg,
            tiempo_por_curso:timeFormated.toISOString().substr(11, 8),
            curso:filtItem.course_name,
            status:filtItem.course_state === "0" ? "EN PROCESO" :"COMPLETADO",
            certificado:filtItem.course_state === "0" ? "NO" :"SI",
            progreso: filtItem.course_progress > 97 ? "100%" : filtItem.course_progress + "%",
            nombre_usuario:filtItem.course_user_name,
            codigo_usuario:filtItem.course_user_login,
            telefono:filtItem.course_user_phone,
            correo:filtItem.course_user_email
          });

          rankingCourses.push(
            { 
              label: filtItem.course_name, 
              value: 1
            }
          )
          
          timeXCourse = timeXCourse+ parseInt(filtItem.course_time);
          promediProgess = promediProgess + filtItem.course_progress / filtered2.length
        })

        const rankinFinalList = rankingCourses.reduce((acc, cur)=> {
          const found = acc.find(val => val.label === cur.label)
          if(found){
              found.value+=Number(cur.value)
          }
          else{
              acc.push({...cur, value: Number(cur.value)})
          }
          return acc
        }, [])


        setTimeStudi(timeXCourse);
        setPromProgress(promediProgess);
        setRankingCoursesList(rankinFinalList);
        setCoursesCompletes(courseIncomplets);
        setCoursesTotal(coursesTotalTmp);
        setDataCsv(csvTemp);
        setActiveUser(filtered);
      })
    }else{
      axios.post('https://api.lessin.pe/wp-json/usuarios/v1/courseVideoDashboard',{
        forcompany:company,
        forcompany_ini:ini,
        forcompany_end:end
      }).then((resp)=>{


        const ids = resp.data.map(({ user_id }) => user_id);
        const filtered = resp.data.filter(({ user_id }, index) => !ids.includes(user_id, index + 1));

        const ids2 = resp.data.map(({ id }) => id);
        const filtered2 = resp.data.filter(({ id }, index) => !ids2.includes(id, index + 1));

        let rankingCourses = [];
        let csvTemp = [];
        filtered2.map((filtItem)=>{
          if(filtItem.course_state === "1"){
            courseIncomplets = courseIncomplets + 1;
          }
          coursesTotalTmp = coursesTotalTmp + 1;

          let companyName = "";
          if(clientsList){
            clientsList.map((cliItem)=>{
              
              if(parseInt(filtItem.course_company) === parseInt(cliItem.id)){
                companyName = cliItem.title.rendered;
                console.log(cliItem.id)
              }
            })
          }
          const dateTmp = new Date(filtItem.date_reg);  // 2009-11-10
          const monthTmp = dateTmp.toLocaleString('default', { month: 'long' });

          const timeFormated = new Date(null);
          timeFormated.setSeconds(parseInt(filtItem.course_time));

          csvTemp.push({
            client:companyName,
            mes:monthTmp,
            fecha_inicio_curso:filtItem.date_reg,
            tiempo_por_curso:timeFormated.toISOString().substr(11, 8),
            curso:filtItem.course_name,
            status:filtItem.course_state === "0" ? "EN PROCESO" :"COMPLETADO",
            certificado:filtItem.course_state === "0" ? "NO" :"SI",
            progreso: filtItem.course_progress > 97 ? "100%" : filtItem.course_progress + "%",
            nombre_usuario:filtItem.course_user_name,
            codigo_usuario:filtItem.course_user_login,
            telefono:filtItem.course_user_phone,
            correo:filtItem.course_user_email
          });

          rankingCourses.push(
            { 
              label: filtItem.course_name, 
              value: 1
            }
          )
          timeXCourse = timeXCourse+ parseInt(filtItem.course_time);
          promediProgess = promediProgess + filtItem.course_progress / filtered2.length
        })

        const rankinFinalList = rankingCourses.reduce((acc, cur)=> {
          const found = acc.find(val => val.label === cur.label)
          if(found){
              found.value+=Number(cur.value)
          }
          else{
              acc.push({...cur, value: Number(cur.value)})
          }
          return acc
        }, [])
        
        setTimeStudi(timeXCourse);
        setPromProgress(promediProgess);
        setRankingCoursesList(rankinFinalList);
        setCoursesCompletes(courseIncomplets);
        setCoursesTotal(coursesTotalTmp);
        setDataCsv(csvTemp);
        setActiveUser(filtered);
      })
      
    }
  }

  const sendFilter = ()=>{
    getAllVisit(clientSelect,rangeSelect.ini,rangeSelect.end);
    getAllUser(clientSelect);
    getActiveUser(clientSelect,rangeSelect.ini,rangeSelect.end);
  }

  // If client
  const [userCliInfo,setUserCliInfo] = useState({
    uc_id:0,
    nombre:'Lessin'
  });


  useEffect(()=>{
    getAllClient();
    if(idCli2 !== '1' ){


      axios.get('https://api.lessin.pe/wp-json/wp/v2/users/' + idCli2,{
        headers:{
          'Authorization': 'Bearer '+ jwt,
        }
      })
      .then((resp)=>{
        setUserCliInfo({
          ...userCliInfo,
          uc_id:resp.data.acf.uc_id,
          nombre:resp.data.acf.nombre
        })
        getAllUser(resp.data.acf.uc_id);
        getAllVisit(resp.data.acf.uc_id,rangeSelect.ini,rangeSelect.end);
        getActiveUser(resp.data.acf.uc_id,rangeSelect.ini,rangeSelect.end);
      })
    }else{
      getAllUser(0);
      getAllVisit(0,rangeSelect.ini,rangeSelect.end);
      getActiveUser(0,rangeSelect.ini,rangeSelect.end);
    }
    console.log(idCli2);
  },[])

  return (
    <>
      <Helmet>
        <title> Dashboard | KPI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola,  {idCli2 !== '1' ? userCliInfo.nombre : 'Lessin'} 
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <Card>
              <CardHeader title={'Filtrar por:'} />
              <CardContent >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <div className='rangeFieldDash' sx={{ pt: 1 }}>
                    
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Seleccione un cliente</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Cliente"
                          onChange={handleChangeSelect}
                        >
                          {clientsList &&
                          clientsList.map((item)=>{
                            return (
                              <MenuItem  value={item.id}>{item.title.rendered}</MenuItem>
                            )
                          })}
                          <MenuItem  value={0}>{'Todos'}</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DateRangePicker']}>
                        <DateRangePicker 
                          localeText={{ start: 'Desde', end: 'Hasta' }} 

                          onChange={(e,o)=>{
                            let dateInitRange = new Date(e[0].$d);
                            const yearRangeFilter = dateInitRange.getFullYear();
                            const montRangeFilter = dateInitRange.getMonth()+1;
                            const dayRangeFilter = dateInitRange.getDate();

                            let dateInitRange2 = new Date(e[1].$d);
                            const yearRangeFilter2 = dateInitRange2.getFullYear();
                            const montRangeFilter2 = dateInitRange2.getMonth()+1;
                            const dayRangeFilter2 = dateInitRange2.getDate();

                            setRangeSelect({
                              ini: yearRangeFilter+'/'+montRangeFilter+'/'+dayRangeFilter,
                              end: yearRangeFilter2+'/'+montRangeFilter2+'/'+dayRangeFilter2
                            })

                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} className='dashBoardBtnFilter'>
                    <Button onClick={sendFilter} variant='contained'   startIcon={<SearchIcon />}>
                      Filtrar
                    </Button>
                    {dataCsv &&
                    <CSVLink className="downloadbtn" separator={";"} filename="information.csv" data={dataCsv ? dataCsv : null}>
                      <Button variant='contained'  startIcon={<GetAppIcon />}>
                        Export to CSV
                      </Button>
                    </CSVLink>
                    }
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Usuarios" total={userList ? parseInt(userList.total) : 0} icon={'ant-design:user'} />

            <div className="userBlock allUser">
              <figure>
                <img src={userIco} />
              </figure>
              <h5>Usuarios inscritos</h5>
              <h3>{userList ? parseInt(userList.total) : 0}</h3>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Usuarios visitantes" total={clientVisit ? clientVisit.length : 0} color="info" icon={'ant-design:user'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Usuarios estudiando" total={activeUser ? activeUser.length : 0} color="warning" icon={'ant-design:user'} />

          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppCurrentVisitsPlatform2
              title={"Progreso promedio"}
              className="progressBlock"
              chartData={[
                { 
                  label: 'Progreso promedio',
                  value:  promProgress 
                }
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main
              ]}
            />

    
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Cursos mas vistos"
              //subheader="(+43%) than last year"
              chartData={rankinCourseLists ? rankinCourseLists : null}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {timeStudi !== 0 &&
            <AppHours title={"Horas de estudio"} duracion={timeStudi} sx={{mb:3}} />
            }
            
            <AppNoGraphics title="Iniciados" porcent={0} icon="1" total={coursesTotal}/>
            <AppNoGraphics title="Completos" porcent={(coursesCompletes*100)/coursesTotal} icon="2" total={coursesCompletes}/>
            <AppNoGraphics title="Incompletos" porcent={(coursesCompletes*100)/coursesTotal} icon="3" total={coursesTotal - coursesCompletes}/>
            <AppNoGraphics title="certificados" porcent={(coursesCompletes*100)/coursesTotal} icon="4" total={coursesCompletes}/>
          </Grid>

          {false &&
          <>
          <Grid item xs={12} sm={6} md={3}>
            <AppNoGraphics title="Cursos Iniciados" porcent={0} icon="1" total={coursesTotal}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppNoGraphics title="Cursos completos" porcent={(coursesCompletes*100)/coursesTotal} icon="2" total={coursesCompletes}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppNoGraphics title="Cursos incompletos" porcent={(coursesCompletes*100)/coursesTotal} icon="3" total={coursesTotal - coursesCompletes}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppNoGraphics title="Usuarios certificados" porcent={(coursesCompletes*100)/coursesTotal} icon="4" total={coursesCompletes}/>
          </Grid>
          </>
          }

          {false &&
          <Grid item xs={12} sm={6} md={3}>
            <AppCurrentVisitsPlatform
              title="Cursos mas vistos"
              chartData={[
                { 
                  label: 'Visitantes',
                  value:  clientVisit ? (clientVisit.length /parseInt(userList.total)) *100 : 0
                },
                { 
                  label: 'Estudiando',
                  value: activeUser ? (activeUser.length /parseInt(userList.total)) *100 : 0 
                }
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main
              ]}
            />
          </Grid>
          }


        </Grid>
      </Container>
    </>
  );
}