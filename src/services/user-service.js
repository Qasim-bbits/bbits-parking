import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class UserServices {  

  getUsers(body){    
    const res = AxiosServices.post(endpoints.user.getUsers, body);
    return res;
  }

  delUser(body){    
    const res = AxiosServices.post(endpoints.user.delUser,body);    
    return res;
  }

  addUser(body){    
    const res = AxiosServices.post(endpoints.user.addUser,body);    
    return res;
  }

  editUser(body){    
    const res = AxiosServices.post(endpoints.user.editUser,body);    
    return res;
  }

  getAgents(){    
    const res = AxiosServices.get(endpoints.user.getAgents);    
    return res;
  }

}
const userServices = new UserServices();
export default userServices;
