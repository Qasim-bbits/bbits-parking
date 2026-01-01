import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class EmailTemplateServices {  

  getEmailTemplates(body){
    const res = AxiosServices.post(endpoints.email_template.getEmailTemplates, body);
    return res;
  }

  addEmailTemplate(body){    
    const res = AxiosServices.post(endpoints.email_template.addEmailTemplate,body);
    return res;
  }

  delEmailTemplate(body){    
    const res = AxiosServices.post(endpoints.email_template.delEmailTemplate,body);
    return res;
  }

  editEmailTemplate(body){    
    const res = AxiosServices.post(endpoints.email_template.editEmailTemplate,body);
    return res;
  }

}
const emailTemplateServices = new EmailTemplateServices();
export default emailTemplateServices;
