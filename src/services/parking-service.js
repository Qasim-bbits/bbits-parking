import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class ParkingService {

  buyParking(body){    
    const res = AxiosServices.post(endpoints.parking.buyParking, body);
    return res;
  }

  getParkings(body){
    const res = AxiosServices.post(endpoints.parking.getParkings, body);
    return res;
  }

  buyVisitorPass(body){    
    const res = AxiosServices.post(endpoints.parking.buyVisitorPass, body);
    return res;
  }

  resetParkingLimit(body){    
    const res = AxiosServices.post(endpoints.parking.resetParkingLimit, body);
    return res;
  }

  getParkingsByCity(body){    
    const res = AxiosServices.post(endpoints.parking.getParkingsByCity, body);
    return res;
  }

  editParking(body){    
    const res = AxiosServices.post(endpoints.parking.editParking, body);
    return res;
  }
  kickOutPlate(body){    
    const res = AxiosServices.post(endpoints.parking.kickOutPlate, body);
    return res;
  }
  exitParking(body){    
    const res = AxiosServices.post(endpoints.parking.exitParking, body);
    return res;
  }

}
const parkingService = new ParkingService();
export default parkingService;
