import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class ScanPlateServices {  

  addScanPlate(body){    
    const res = AxiosServices.post(endpoints.scanPlates.addScanPlate, body);    
    return res;
  }

  getScanPlates(){    
    const res = AxiosServices.get(endpoints.scanPlates.getScanPlates);    
    return res;
  }

  delScanPlate(body){    
    const res = AxiosServices.post(endpoints.scanPlates.delScanPlate, body);    
    return res;
  }

  getScanPlatesByToken(token){
    const res = AxiosServices.get(`${endpoints.scanPlates.getScanPlates}/${token}`);
    return res;
  }

}
const scanPlateServices = new ScanPlateServices();
export default scanPlateServices;
