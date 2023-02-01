import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class DashboardService {

  getDashboard(body){    
    const res = AxiosServices.post(endpoints.dashboard.getDashboard, body);
    return res;
  }

}
const dashboardService = new DashboardService();
export default dashboardService;
