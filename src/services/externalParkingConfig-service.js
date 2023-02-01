import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class ExternalParkingConfigServices {  

  getExternalParkingConfig(body){    
    const res = AxiosServices.post(endpoints.externalParkingConfig.getExternalParkingConfig, body);    
    return res;
  }

  getZoneByOrg(body){    
    const res = AxiosServices.post(endpoints.externalParkingConfig.getZoneByOrg, body);    
    return res;
  }

  addExternalParkingConfig(body){    
    const res = AxiosServices.post(endpoints.externalParkingConfig.addExternalParkingConfig, body);    
    return res;
  }

  editExternalParkingConfig(body){    
    const res = AxiosServices.post(endpoints.externalParkingConfig.editExternalParkingConfig, body);    
    return res;
  }

  delExternalParkingConfig(body){
    const res = AxiosServices.post(endpoints.externalParkingConfig.delExternalParkingConfig,body);
    return res;
  }
}
const externalParkingConfigServices = new ExternalParkingConfigServices();
export default externalParkingConfigServices;
