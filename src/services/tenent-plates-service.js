import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class TenentPlateServices {  

  getTenantPlates(body){
    const res = AxiosServices.post(endpoints.tenant_plates.getTenantPlates, body);
    return res;
  }

  addTenentPlate(body){    
    const res = AxiosServices.post(endpoints.tenant_plates.addTenentPlate,body);
    return res;
  }

  delTenentPlate(body){    
    const res = AxiosServices.post(endpoints.tenant_plates.delTenentPlate,body);
    return res;
  }

  editTenentPlate(body){    
    const res = AxiosServices.post(endpoints.tenant_plates.editTenentPlate,body);
    return res;
  }

}
const tenentPlateServices = new TenentPlateServices();
export default tenentPlateServices;
