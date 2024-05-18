import { useEffect, useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../../../components/iconify';

// Login Service
import UserContext from "../../../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// ----------------------------------------------------------------------



export default function LoginForm({onLogin}) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { isLogged,loginUp  } = useContext(UserContext);


  const [body, setBody] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const changeManager = (e) => {
    setBody({
      ...body,
      [e.target.name]: e.target.value,
    });
  };
  
  const onSubmit = (data) => {
    loginUp(data.email, data.password);
    //navigate('/dashboard/app', { replace: true });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Ingrese un usuario valido.")
      .min(3,'Debe tener al menos 2 caracteres.')
      .max(40, 'No debe exceder los 40 caracteres.'),
    password: Yup.string()
      .required("Ingrese una contraseña valida por favor.")
      .min(3,'Debe tener al menos 2 caracteres.')
      .max(40, 'No debe exceder los 40 caracteres.'),
  });


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    shouldUnregister: true,
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (isLogged) {
      navigate("/dashboard/app");
      onLogin && onLogin();
    }
    console.log(isLogged);
  }, [isLogged, onLogin ]);

  return (
    <>
      <form  onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          
          <TextField 
            name="email" 
            id="email"
            label="Correo"
            onChange={changeManager}
            {...register("email")}
            error={errors.email ? true : false}
            
          />

          <TextField
            name="password"
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            onChange={changeManager}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            
            {...register("password")}
            error={errors.password ? true : false}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Checkbox name="remember" label="Remember me" />
          <Link variant="subtitle2" underline="hover">
            Forgot password?
          </Link>
        </Stack>
        <LoadingButton fullWidth size="large" type="submit" variant="contained" >
          Login
        </LoadingButton>
      </form>
    </>
  );
}
