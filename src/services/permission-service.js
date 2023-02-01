import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class PermissionServices {  

  addPermission(body){    
    const res = AxiosServices.post(endpoints.permission.addPermission, body);    
    return res;
  }

  editPermission(body){    
    const res = AxiosServices.post(endpoints.permission.editPermission, body);    
    return res;
  }

  delPermission(body){    
    const res = AxiosServices.post(endpoints.permission.delPermission, body);    
    return res;
  }

  getPermissions(body){
    const res = AxiosServices.post(endpoints.permission.getPermissions, body);    
    return res;
  }

  getUserPermissions(body){    
    const res = AxiosServices.post(endpoints.permission.getUserPermissions, body);    
    return res;
  }

  getModulePermissions(body){    
    const res = AxiosServices.post(endpoints.permission.getModulePermissions, body);    
    return res;
  }

  getAgentPermissions(body){    
    const res = AxiosServices.post(endpoints.permission.getAgentPermissions, body);    
    return res;
  }

}
const permissionServices = new PermissionServices();
export default permissionServices;
