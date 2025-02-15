import axios from 'axios';

export class AxiosServices {  

  async post(url,body){      
    const res = await axios.post(url, body)
    return res;        
    }

  async get(url, header){      
    const res = await axios.get(url, header)
    return res;        
  }

  async delete(url){      
    const res = await axios.delete(url)
    return res;        
    }

}
const axiosServices = new AxiosServices();
export default axiosServices;
