import axios from 'axios';
import globalRouter from '../Helpers/GlobalRouter';
import Swal from 'sweetalert2'

  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      // Do something before the request is sent
      // For example, add an authentication token to the headers
      const userLogged = JSON.parse(sessionStorage.getItem('userLogged'));
       if (userLogged) {
        config.headers.Authorization = userLogged.token;
      }
      return config;
    },
    function (error) {
      // Handle the error
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      // Do something with the response data
      return response;
    },
    function (error) {
      // Handle the response error
      if (error.response && error.response.status === 401) {
        Swal.fire({
            position: "top-center",
            icon: "error",
            title: error.response.data.msg,
            showConfirmButton: false,
            timer: 5000
        });
        globalRouter.navigate('/');
        // Perform any logout actions or redirect to login page
      }
      return Promise.reject(error);
    }
  );

  export default axios;