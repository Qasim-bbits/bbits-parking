import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class BusinessPassPlatesServices {  

  getBusinessPassPlates(body){
    const res = AxiosServices.post(endpoints.business_pass_plates.getBusinessPassPlates, body);
    return res;
  }

  addBusinessPassPlates(body){    
    const res = AxiosServices.post(endpoints.business_pass_plates.addBusinessPassPlates,body);
    return res;
  }

  delBusinessPassPlates(body){    
    const res = AxiosServices.post(endpoints.business_pass_plates.delBusinessPassPlates,body);
    return res;
  }

  editBusinessPassPlates(body){    
    const res = AxiosServices.post(endpoints.business_pass_plates.editBusinessPassPlates,body);
    return res;
  }

}
const businessPassPlateServices = new BusinessPassPlatesServices();
export default businessPassPlateServices;
