import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';
import { config } from '../Constants';

export class AuthServices {  

  headers(){
    let obj = {
      'Authorization': 'Basic '+btoa(config.constant.username+':'+config.constant.password),
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
    return obj;
  }

  signup(body){    
    const res = AxiosServices.post(endpoints.auth.signup, body);
    return res;
  }

  verify(body){    
    const res = AxiosServices.post(endpoints.auth.verify, body);
    return res;
  }

  login(body){    
    const res = AxiosServices.post(endpoints.auth.login, body);    
    return res;
  }

  resetPassword(body){    
    const res = AxiosServices.post(endpoints.auth.resetPassword, body);    
    return res;
  }

  adminLogin(body){    
    const res = AxiosServices.post(endpoints.auth.adminLogin, body);    
    return res;
  }

  editPassword(body){
    const res = AxiosServices.post(endpoints.auth.editPassword, body);    
    return res;
  }

  forgetPassword(body){
    const res = AxiosServices.post(endpoints.auth.forgetPassword, body);    
    return res;
  }

  changePassword(body){
    const res = AxiosServices.post(endpoints.auth.changePassword, body);    
    return res;
  }

  externalParking(body){ 
    body.headers = this.headers();  
    const res = AxiosServices.post(config.url.API_URL+ 'externalParking', body);    
    return res;
  }

}
const authServices = new AuthServices();
export default authServices;
