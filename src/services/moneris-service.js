import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class MonerisService {

  generateToken(body){    
    const res = AxiosServices.post(endpoints.moneris.generateToken, body);
    return res;
  }

  monerisReceipt(body){    
    const res = AxiosServices.post(endpoints.moneris.monerisReceipt, body);
    return res;
  }

}
const monerisService = new MonerisService();
export default monerisService;
