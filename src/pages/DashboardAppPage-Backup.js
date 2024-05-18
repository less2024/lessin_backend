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
  CardContent
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

// components
import Iconify from '../components/iconify';
// sections
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { useEffect, useState } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function DashboardAppPageBackup() {
  const theme = useTheme();

  const [userList,setUserList] = useState();
  const [userAllClients,setUserAllClients] = useState();
  const [coursesPlus,setCoursesPlus] = useState([]);
  const [coursesList,setCoursesList] = useState();

  const [userVisits,setUserVisits] = useState([]);

  const [timeStudi,setTimeStudi] = useState(0);
  const [coursesCompletes,setCoursesCompletes] = useState();
  const [rankinCourseLists,setRankingCoursesList] = useState([]);



  // Formulario
  const [fieldCompany, setFieldCompany] = useState('');

  const handleChangeCompany = (event) => {
    setFieldCompany(event.target.value);
    console.log(event.target.value);
  };
  

  const [clientsAll,setClientsAll] = useState();
  const getClients = () =>{
    axios.get('https://api.lessin.pe/wp-json/wp/v2/clientes')
      .then((resp)=>{
        setClientsAll(resp.data)
      })
  }

  const getCoursesUser = ()=>{
    var test = 0;
    var courseIncomplets = 0;
    let rankingCourses = [];
    axios.post('https://api.lessin.pe/wp-json/usuarios/v1/courseVideoDashboard')
      .then((resp)=>{
        resp.data.map((item)=>{
          const lista = JSON.parse(item.courses_list);
          let timeXCourse= 0;
          lista.map((sitem)=>{
            const subLista = sitem.pcurso_temario_lista;
            subLista.map((ssitem)=>{
              test = test + parseInt(ssitem.pcurso_temario_ltime);
              timeXCourse = timeXCourse + parseInt(ssitem.pcurso_temario_ltime);
              setTimeStudi(test);
            })
          })

          // Complets
          if(item.course_state === "1"){
            courseIncomplets = courseIncomplets + 1;
          }

          // Ranking courses
          if(rankingCourses.length >0){
            rankingCourses.findIndex((rkItem,rkIndex)=>{
              if(rkItem.label === item.course_id){
                rankingCourses[rkIndex].value = rkItem.value + 1; 
              }
            })
          }else{
            rankingCourses.push(
              { 
                label: item.course_id, 
                value: 1
              }
            )
          }


        })

        setRankingCoursesList(rankingCourses);
        setCoursesCompletes(courseIncomplets);
        setUserList(resp.data);
      })
  }

  const getAllUser = () =>{
    axios.post('https://api.lessin.pe/wp-json/usuarios/v1/clienteDash')
      .then((resp)=>{
        const userVisits = [];
        resp.data.map((item)=>{
          if(item.user_state === '1'){
            userVisits.push(item);
          }
        })
        setUserVisits(userVisits);
        setUserAllClients(resp.data)
      }).then((errr)=>{
        console.log(errr)
      })
  }

  const getCourses = () =>{
    axios.get('https://api.lessin.pe/wp-json/wp/v2/cursos')
      .then((resp)=>{
        const newCourses = [];
        resp.data.map((item)=>{
          newCourses.push({ 
            label: item.title.rendered, 
            value: 100 
          })
        })
        setCoursesPlus(newCourses);
        setCoursesList(resp.data);
      })
  }

  useEffect(()=>{
    getAllUser();
    getCoursesUser();
    getCourses();
    getClients();
  },[])

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola, Lessin
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
                          value={fieldCompany}
                          label="Age"
                          onChange={handleChangeCompany}
                        >
                          {clientsAll &&
                            clientsAll.map((item)=>{
                              return(
                                <MenuItem value={item.id}>{item.title.rendered}</MenuItem>
                              )
                            })
                          }
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
                            console.log(yearRangeFilter+'/'+montRangeFilter+'/'+dayRangeFilter)

                            let dateInitRange2 = new Date(e[1].$d);
                            const yearRangeFilter2 = dateInitRange2.getFullYear();
                            const montRangeFilter2 = dateInitRange2.getMonth()+1;
                            const dayRangeFilter2 = dateInitRange2.getDate();
                            console.log(yearRangeFilter2+'/'+montRangeFilter2+'/'+dayRangeFilter2)

                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button>
                      Filtrar
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Usuarios" total={userAllClients ? userAllClients.length : null} icon={'ant-design:user'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Usuarios visitantes" total={userVisits ? userVisits.length : null} color="info" icon={'ant-design:user'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Usuarios estudiando" total={userList ? userList.length : null} color="warning" icon={'ant-design:user'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Horas de estudio" total={timeStudi} color="error" icon={'ant-design:user'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Cursos mas vistos"
              //subheader="(+43%) than last year"
              //chartData={rankinCourseLists ? rankinCourseLists : null}
              chartData={rankinCourseLists}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Completos / Incompletos"
              chartData={[
                { 
                  label: 'Completos',
                  value: coursesCompletes ? coursesCompletes : 0
                },
                { 
                  label: 'Incompletos',
                  value: userList ? userList.length  - coursesCompletes : 0 
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
          
          {false &&
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Horas de estudios"
              //subheader="Tiempo total de estudio1 hrs"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
                '12/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>
          }

          {false &&
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Cursos mas vistos"
              chartData={[
                { 
                  label: 'Completos',
                  value: coursesCompletes ? coursesCompletes : 0
                },
                { 
                  label: 'Incompletos',
                  value: userList ? userList.length  - coursesCompletes : 0 
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

          {false &&
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>
          }

        </Grid>
      </Container>
    </>
  );
}