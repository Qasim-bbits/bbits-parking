import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class VirtualMeterAdServices {  

  getVirtualMeterAds(body){
    const res = AxiosServices.post(endpoints.virtual_meter_ads.getVirtualMeterAds, body);
    return res;
  }

  getVirtualMeterAdById(body){
    const res = AxiosServices.post(endpoints.virtual_meter_ads.getVirtualMeterAdById, body);
    return res;
  }

  addVirtualMeterAd(body){    
    const res = AxiosServices.post(endpoints.virtual_meter_ads.addVirtualMeterAd,body);
    return res;
  }

  delVirtualMeterAd(body){    
    const res = AxiosServices.post(endpoints.virtual_meter_ads.delVirtualMeterAd,body);
    return res;
  }

  editVirtualMeterAd(body){    
    const res = AxiosServices.post(endpoints.virtual_meter_ads.editVirtualMeterAd,body);
    return res;
  }

  upload_compaign(body){    
    const res = AxiosServices.post(endpoints.virtual_meter_ads.upload_compaign,body);
    return res;
  }

}
const virtualMeterAdServices = new VirtualMeterAdServices();
export default virtualMeterAdServices;
