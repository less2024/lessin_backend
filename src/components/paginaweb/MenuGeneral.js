import { useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';
import { faker } from '@faker-js/faker';

// @mui
import { 
    Box,
    IconButton,
    Button,
    Typography,
    Modal,
    Paper,
    Stack,
    List,
    TextField,
    ListItem,
    Autocomplete,
    ListItemText
 } from '@mui/material';

// Iconos
import Iconify from '../iconify/Iconify';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import AddIcon from '@mui/icons-material/Add';


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

 // Axios
import axios from 'axios';

MenuGeneral.propTypes = {
    updateState:PropTypes.func,
    dataState:PropTypes.object
};

function MenuGeneral({updateState, dataState, ...other}) {

    const [menuOpen, setMenuOpen] = useState(false);
    const [categories,setCategories] = useState([]);
    const [selectCategory,setSelectCategory] = useState();
    const [menu,setMenu] = useState([]);
    const [menuAction,setMenuAction] = useState(false);
    const [menuSelectedAction,setMenuSelectedAction] = useState();
    const addMenuClose = () => setMenuOpen(false);
    

    // Sub Menu Stats
    const [subMenuForm,setSubMenuForm] = useState(false);
    const [subMenuAction,setSubMenuAction] = useState(false);

    // Menu
    const [menuItem1,setMenuItem1] = useState({
        mnombre:'',
        mslug:''
    });

    const addMenuOpen = () =>{
        setMenuOpen(true)
        setMenuAction(false)
        setSubMenuForm(false)
        setMenuItem1({
            mnombre:'',
            mslug:''
        })
    }

    const changeMenuLvl1 = (e)=>{
        setMenuItem1({
            ...menuItem1,
            [e.target.name]:e.target.value
        })
    }

    const insertMenu = () => {
        setMenu([
            ...menu,
            {
                id:faker.datatype.uuid(),
                menu_general_titulo:menuItem1.mnombre,
                menu_general_slug:menuItem1.mslug,
                menu_list:[]
            }
        ])
        updateState([
            ...menu,
            {
                id:faker.datatype.uuid(),
                menu_general_titulo:menuItem1.mnombre,
                menu_general_slug:menuItem1.mslug,
                menu_list:[]
            }
        ])
        setMenuItem1({
            mnombre:'',
            mslug:''
        })
        addMenuClose();
    }

    const removeItemMenu = (item) =>{
        setMenu(
            menu.filter((menuIn) => menuIn.id !== item.id)
        );
        updateState(
            menu.filter((menuIn) => menuIn.id !== item.id)
        );

    }

    const editOpenModal = (item) =>{
        setMenuOpen(true)
        setMenuAction(true)
        setMenuSelectedAction(item.id)
        setMenuItem1({
            mnombre:item.menu_general_titulo,
            mslug:item.menu_general_slug
        })
    }

    const updateMenu = () =>{
        setMenu(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                            ...menuItem,
                            id:menuItem.id,
                            menu_general_titulo:menuItem1.mnombre,
                            menu_general_slug:menuItem1.mslug
                        }
                    
                }else{
                    return {...menuItem}
                }
            })
        );
        updateState(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                            ...menuItem,
                            id:menuItem.id,
                            menu_general_titulo:menuItem1.mnombre,
                            menu_general_slug:menuItem1.mslug
                        }
                    
                }else{
                    return {...menuItem}
                }
            })
        );

        addMenuClose();
    }

    // Agregar sub menu
    const addCategoryModal = (item) =>{
        setSubMenuForm(true);
        setMenuOpen(true);
        setMenuSelectedAction(item.id);
        setSubMenuAction(false)
    }

    // Get categorias
    const getCategorias = () =>{
        axios.get('https://api.lessin.pe/wp-json/wp/v2/categoria').then((resp)=>{
            setCategories(resp.data);
        }).catch((error)=>{
            console.log(error)
        })
    }

    const changeCategories = (event,newValue) =>{
        setSelectCategory(newValue);
    }

    const insertCategory = () =>{
        setMenu(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                        ...menuItem, 
                        menu_list:[
                            ...menuItem.menu_list,
                            {
                                id:faker.datatype.uuid(),
                                menu_cat:selectCategory.name,
                                menu_catico:String(selectCategory.id),
                                icon:selectCategory.acf.catcur_icono,
                                menu_sublista:[]
                            }
                        ]
                    }
                }else{
                    return {...menuItem}
                }
            })
        );

        updateState(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                        ...menuItem, 
                        menu_list:[
                            ...menuItem.menu_list,
                            {
                                id:faker.datatype.uuid(),
                                menu_cat:selectCategory.name,
                                menu_catico:String(selectCategory.id),
                                icon:selectCategory.acf.catcur_icono,
                                menu_sublista:[]
                            }
                        ]
                    }
                }else{
                    return {...menuItem}
                }
            })
        );

        addMenuClose();
    }

    const removeSubCat = (item,subItem) =>{
        const newState = item.menu_list.filter(obj => {
            return obj.id !== subItem.id;
        });
        
        setMenu(
            menu.map((cat,index) =>{
                if(item.id === cat.id){
                    return {...cat,menu_list:newState}
                }else{
                    return {...cat}
                }
            })
        );

        updateState(
            menu.map((cat,index) =>{
                if(item.id === cat.id){
                    return {...cat,menu_list:newState}
                }else{
                    return {...cat}
                }
            })
        );
    }

    const [catTemp,setCatTemp] = useState();
    const [idEditCat,setIdEditCat]  = useState();
    const openEdithSubCat = (item,subItem) =>{
        setMenuOpen(true);
        setSubMenuAction(true);
        setSubMenuForm(true);
        setCatTemp(item.menu_list)
        setIdEditCat(subItem)
        setMenuSelectedAction(item.id);
    }

    const upadteCategory = () =>{
        console.log(menuSelectedAction)
        
        const newState = catTemp.map(obj => {
            if (obj.id === idEditCat.id) {
                return {
                    ...obj,
                    menu_cat:selectCategory.name,
                    menu_catico:String(selectCategory.id),
                    icon:selectCategory.acf.catcur_icono,
                    
                };
            }
            return obj;
        });
        
        setMenu(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                            ...menuItem,
                            menu_list:newState
                        }
                    
                }else{
                    return {...menuItem}
                }
            })
        );

        updateState(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                            ...menuItem,
                            menu_list:newState
                        }
                    
                }else{
                    return {...menuItem}
                }
            })
        );
        

        addMenuClose();
    }

    // Agregar pagina
    const [menuPageOpen,setMenuPageOpen] = useState(false);
    const addMenuPageClose = () => setMenuPageOpen(false);
    const [pages,setPages] = useState();
    const [tmpPage,setTmpPage] = useState();
    const [editPage,setEditPage] = useState();
    const [menuPage,setMenuPage] = useState({
        pname:'',
        pslug:''
    });
    const [pageAction,setPageAction] = useState(false);

    const addOpenPage = (item,subItem) =>{
        setCatTemp(item.menu_list);
        setIdEditCat(subItem);
        setMenuPageOpen(true);
        setTmpPage(subItem.menu_sublista);
        setMenuSelectedAction(item.id);
    }

    const edithOpenPage = (item,subItem,subItem2) =>{
        setCatTemp(item.menu_list);
        setIdEditCat(subItem);
        setMenuPageOpen(true);
        setTmpPage(subItem.menu_sublista);
        setMenuSelectedAction(item.id);
        setEditPage(subItem2)
        setMenuPage({
            pname:subItem2.menu_sltitulo,
            pslug:subItem2.menu_slslug
        });
        setPageAction(true);
    }

    const changePages = (event,newValue) =>{
        setMenuPage({
            ...menuPage,
            pslug:newValue.slug
        })
    }

    const changeMenuPage = (e) =>{
        setMenuPage({
            ...addOpenPage,
            [e.target.name]:e.target.value
        })
    }
    
    const insertPage = () =>{
        const newState= tmpPage
        newState.push({
            id:faker.datatype.uuid(),
            menu_sltitulo:menuPage.pname,
            menu_slslug:menuPage.pslug
        })

        const newState2 = catTemp.map(obj => {
            if (obj.id === idEditCat.id) {
                return {
                    ...obj,
                    menu_sublista:newState
                };
            }
            return obj;
        });
        
        setMenu(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                            ...menuItem,
                            menu_list:newState2
                        }
                }else{
                    return {...menuItem}
                }
            })
        );

        updateState(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                            ...menuItem,
                            menu_list:newState2
                        }
                }else{
                    return {...menuItem}
                }
            })
        );

        setMenuPage({
            pname:'',
            pslug:''
        })
        addMenuPageClose();
    }

    const upadtePage = () =>{
        const newState = tmpPage.map(obj => {
            if (obj.id === editPage.id) {
                return {
                    ...obj,
                    menu_sltitulo:menuPage.pname,
                    menu_slslug:menuPage.pslug
                };
            }
            return obj;
        });

        const newState2 = catTemp.map(obj => {
            if (obj.id === idEditCat.id) {
                return {
                    ...obj,
                    menu_sublista:newState
                };
            }
            return obj;
        });
        
        setMenu(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                            ...menuItem,
                            menu_list:newState2
                        }
                    
                }else{
                    return {...menuItem}
                }
            })
        );

        updateState(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                            ...menuItem,
                            menu_list:newState2
                        }
                    
                }else{
                    return {...menuItem}
                }
            })
        );

        setMenuPage({
            pname:'',
            pslug:''
        })
        setPageAction(false);
        addMenuPageClose();
    }
    
    const removePage = (item,subItem,subITem2) =>{
        console.log()
        const newState = subItem.menu_sublista.filter(obj => {
            return obj.id !== subITem2.id;
        });
        
        const newState2 = catTemp.map(obj => {
            if (obj.id === subItem.id) {
                return {
                    ...obj,
                    menu_sublista:newState
                };
            }
            return obj;
        });
        
        setMenu(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                            ...menuItem,
                            menu_list:newState2
                        }
                }else{
                    return {...menuItem}
                }
            })
        );

        updateState(
            menu.map((menuItem,index) =>{
                if(menuSelectedAction === menuItem.id){
                    return {
                            ...menuItem,
                            menu_list:newState2
                        }
                }else{
                    return {...menuItem}
                }
            })
        );

        setMenuPage({
            pname:'',
            pslug:''
        })
        addMenuPageClose();
    }

    const getPages = () =>{
        axios.get('https://api.lessin.pe/wp-json/wp/v2/cursos')
        .then((resp)=>{
            setPages(resp.data);
        })
    }

    useEffect(()=>{
        getCategorias();
        getPages();
        if(dataState){
            updateState(dataState)
            setMenu(dataState)
            console.log(dataState)
        }else{
            setMenu([])
            updateState([])
        }
    },[dataState])

    return (
      <Box >
        <Paper elevation={3} sx={{
            padding:'20px'
            }} 
            variant={'outlined'}
            {...other} 
        >

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" >
                    Menu
                </Typography>
                <Button 
                    variant="outlined" 
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={addMenuOpen}
                >
                    Agregar
                </Button>
            </Stack>


            {menu.length > 0 &&
                <Stack spacing={0} sx={{ mb: 4 }}>
                    {menu.map((item)=>{
                        return(
                            <>
                                <ListItem disablePadding key={item.id} >
                                    <KeyboardArrowRightTwoToneIcon sx={{pr:1}} />
                                    <ListItemText primary={item.menu_general_titulo} />
                                    <IconButton onClick={()=>addCategoryModal(item)}>
                                        <AddIcon />
                                    </IconButton>
                                    <IconButton onClick={()=>editOpenModal(item)}>
                                        <EditIcon  />
                                    </IconButton>

                                    <IconButton onClick={()=>removeItemMenu(item)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItem>
                                {item.menu_list.length > 0 &&
                                    item.menu_list.map((subItem)=>{
                                    return (
                                        <>
                                            <List disablePadding>
                                                <ListItem disablePadding key={subItem.id} sx={{ pl: 1 }}>
                                                    <IconButton>
                                                    < KeyboardDoubleArrowRightIcon  sx={{pr:1}} />
                                                    </IconButton>
                                                    <ListItemText secondary={subItem.menu_cat} />
                                                    <IconButton onClick={()=>{addOpenPage(item,subItem)}}>
                                                        <AddIcon/>
                                                    </IconButton>
                                                    <IconButton onClick={()=>openEdithSubCat(item,subItem)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={()=>removeSubCat(item,subItem)}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </ListItem>
                                            </List>
                                            {subItem.menu_sublista.length > 0 &&
                                                subItem.menu_sublista.map((subItem2)=>{
                                                return (
                                                    <List disablePadding>
                                                        <ListItem  key={subItem2.id} sx={{ pl: 3 }} disablePadding>
                                                            
                                                                <SubdirectoryArrowRightIcon  sx={{pr:1}} />
                                                            
                                                            <ListItemText secondary={subItem2.menu_sltitulo} />

                                                            <IconButton onClick={()=>edithOpenPage(item,subItem,subItem2)}>
                                                                <EditIcon/>
                                                            </IconButton>
                                                            <IconButton onClick={()=>removePage(item,subItem,subItem2)}>
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </ListItem>
                                                    </List>
                                                )
                                            })}
                                        </>
                                    );
                                })}
                            </>
                        )
                    })}

                </Stack>
            }

        </Paper>

        <Modal
            open={menuOpen}
            onClose={addMenuClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            {subMenuForm === false ?
                <Box sx={style}>
                    <Typography variant="h4" onClick={()=>console.log(menu)}>
                        {menuAction ? 'Editar': 'Agregar'}
                    </Typography>
                    <Stack spacing={2} sx={{mb:2,mt:2}}>
                        <TextField id="outlined-basic" label="Nombre" onChange={changeMenuLvl1} name="mnombre" value={menuItem1.mnombre} />
                        <TextField id="osaasdasd" label="Slug" onChange={changeMenuLvl1} name="mslug" value={menuItem1.mslug} />
                    </Stack>
                    <Button variant='contained' onClick={menuAction ? updateMenu :insertMenu}  sx={{mr:2}} >{menuAction ?'Actualizar' : 'Agregar'}</Button>
                    <Button variant='outlined' onClick={addMenuClose}>Cerrar</Button>
                </Box>
            :
                <Box sx={style}>
                    <Typography variant="h4">
                        {subMenuAction ?'Editar sub menu' : 'Agregar sub menu'}
                    </Typography>
                    <Stack spacing={2} sx={{mb:2,mt:2}}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={categories}
                            onChange={changeCategories}
                            getOptionLabel={option => option.name}
                            sx={{zIndex:9 }}
                            renderInput={(params) => <TextField {...params} label="Categoría" />}
                        />
                    </Stack>
                    <Button variant='contained' onClick={subMenuAction ? upadteCategory  : insertCategory} sx={{mr:2}}>{subMenuAction ? 'Actualizar' : 'Agregar'}</Button>
                    <Button variant='outlined' onClick={addMenuClose}>Cerrar</Button>
                </Box>
            }
        </Modal>
        <Modal
            open={menuPageOpen}
            onClose={addMenuPageClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h4">
                    {pageAction ?'Editar página' : 'Agregar página'}
                </Typography>
                <Stack spacing={2} sx={{mb:2,mt:2}}>
                    <TextField id="outlined-basic" label="Nombre" onChange={changeMenuPage} name="pname" value={menuPage.pname} />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo2"
                        options={pages}
                        onChange={changePages}
                        getOptionLabel={option => option.title.rendered}
                        sx={{zIndex:9 }}
                        renderInput={(params) => <TextField {...params} label="Link" />}
                    />
                </Stack>
                <Button variant='contained' onClick={pageAction ? upadtePage  : insertPage} sx={{mr:2}}>{pageAction ? 'Actualizar' : 'Agregar'}</Button>
                <Button variant='outlined' onClick={addMenuPageClose}>Cerrar</Button>
            </Box>
        </Modal>
      </Box>
    );

}

export default MenuGeneral;
