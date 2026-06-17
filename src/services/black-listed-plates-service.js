import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class BlackListedPlateServices {  

  getBlackListedPlates(body){
    const res = AxiosServices.post(endpoints.black_listed_plates.getBlackListedPlates, body);
    return res;
  }

  addBlackListedPlate(body){    
    const res = AxiosServices.post(endpoints.black_listed_plates.addBlackListedPlate,body);
    return res;
  }

  delBlackListedPlate(body){    
    const res = AxiosServices.post(endpoints.black_listed_plates.delBlackListedPlate,body);
    return res;
  }

  editBlackListedPlate(body){    
    const res = AxiosServices.post(endpoints.black_listed_plates.editBlackListedPlate,body);
    return res;
  }

}
const residantPlateServices = new BlackListedPlateServices();
export default residantPlateServices;
