import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class ResidantPlateServices {  

  getResidantPlates(body){
    const res = AxiosServices.post(endpoints.residant_plates.getResidantPlates, body);
    return res;
  }

  addResidantPlate(body){    
    const res = AxiosServices.post(endpoints.residant_plates.addResidantPlate,body);
    return res;
  }

  delResidantPlate(body){    
    const res = AxiosServices.post(endpoints.residant_plates.delResidantPlate,body);
    return res;
  }

  editResidantPlate(body){    
    const res = AxiosServices.post(endpoints.residant_plates.editResidantPlate,body);
    return res;
  }

}
const residantPlateServices = new ResidantPlateServices();
export default residantPlateServices;
