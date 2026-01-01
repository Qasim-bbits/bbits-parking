import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class NoteServices {  

  addNote(body){    
    const res = AxiosServices.post(endpoints.notes.addNote, body);    
    return res;
  }

  editNote(body){    
    const res = AxiosServices.post(endpoints.notes.editNote, body);    
    return res;
  }

  delNote(body){    
    const res = AxiosServices.post(endpoints.notes.delNote, body);    
    return res;
  }

  getNotes(body){
    const res = AxiosServices.post(endpoints.notes.getNotes, body);
    return res;
  }

  getNotesByOrg(body){
    const res = AxiosServices.post(endpoints.notes.getNotesByOrg, body);
    return res;
  }

  getNotesByType(body){
    const res = AxiosServices.post(endpoints.notes.getNotesByType, body);
    return res;
  }
}
const noteServices = new NoteServices();
export default noteServices;
