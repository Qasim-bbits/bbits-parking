import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';
import { config } from '../Constants';

export class OrganizationServices {  

  addOrganization(body){    
    const res = AxiosServices.post(endpoints.organization.addOrganization, body);    
    return res;
  }

  editOrganization(body){    
    const res = AxiosServices.post(endpoints.organization.editOrganization, body);    
    return res;
  }

  delOrganization(body){    
    const res = AxiosServices.post(endpoints.organization.delOrganization, body);    
    return res;
  }

  getOrganizations(){
    const res = AxiosServices.get(endpoints.organization.getOrganizations);    
    return res;
  }

  getOrgBySubDomain = async ()=>{
    let url = window.location.host;
    let split = url.split('.');
    let body = {};
    if(split.length > config.constant.sub_domain_length){
      body.sub_domain = split[0].toLowerCase();
    }else{
      body.role = 'root';
    }
    const res = await AxiosServices.post(endpoints.organization.getOrgBySubDomain, body);
    if(split.length > config.constant.sub_domain_length){
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.type="image/png"
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = config.url.file_url+res.data[0].logo;
      document.title = res.data[0].org_name.toUpperCase()
      return res.data[0];
    }else{
      return res.data[0].org;
    }
  }
}
const organizationServices = new OrganizationServices();
export default organizationServices;
