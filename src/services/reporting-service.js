import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class ReportingServices {  

  getAllKeys(body){    
    const res = AxiosServices.post(endpoints.reporting.getAllKeys, body);    
    return res;
  }

  generateReport(body){    
    const res = AxiosServices.post(endpoints.reporting.generateReport, body);    
    return res;
  }

  exportPDF(body){    
    const res = AxiosServices.post(endpoints.reporting.exportPDF, body);    
    return res;
  }

  generateTicketIssuedReport(body){    
    const res = AxiosServices.post(endpoints.reporting.generateTicketIssuedReport, body);    
    return res;
  }

  getOrgImage(body){ 
    console.log(body)   
    const res = AxiosServices.post(endpoints.organization.getOrgImage, body);
    return res;
  }

  getLookups(body){
    const res = AxiosServices.get(endpoints.reporting.lookups, body);
    return res;
  }
  
  generateReportV2(filters, groupByZone){
    const res = AxiosServices.post(endpoints.reporting.reports_v2, { filters, groupByZone });
    return res;
  }
}
const reportingServices = new ReportingServices();
export default reportingServices;
