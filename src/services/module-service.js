import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class ModuleServices {  

  addModule(body){    
    const res = AxiosServices.post(endpoints.module.addModule, body);    
    return res;
  }

  editModule(body){    
    const res = AxiosServices.post(endpoints.module.editModule, body);    
    return res;
  }

  delModule(body){    
    const res = AxiosServices.post(endpoints.module.delModule, body);    
    return res;
  }

  getModules(){
    const res = AxiosServices.get(endpoints.module.getModules);    
    return res;
  }

}
const moduleServices = new ModuleServices();
export default moduleServices;
