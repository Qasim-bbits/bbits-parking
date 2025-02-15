import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class KickOutPlateServices {

  getKickOutPlates(body){
    const res = AxiosServices.post(endpoints.kickOutPlate.getKickOutPlates, body);    
    return res;
  }

}
const kickOutPlateServices = new KickOutPlateServices();
export default kickOutPlateServices;
