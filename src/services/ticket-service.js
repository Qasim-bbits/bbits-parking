import AxiosServices from './axios-service';
import {endpoints} from './api-end-points';

export class TicketServices {  

  addTicket(body){    
    const res = AxiosServices.post(endpoints.ticket.addTicket, body);    
    return res;
  }

  editTicket(body){    
    const res = AxiosServices.post(endpoints.ticket.editTicket, body);    
    return res;
  }

  delTicket(body){    
    const res = AxiosServices.post(endpoints.ticket.delTicket, body);    
    return res;
  }

  getTickets(body){
    const res = AxiosServices.post(endpoints.ticket.getTickets, body);
    return res;
  }

  getAgingByTicket(body){
    const res = AxiosServices.post(endpoints.ticket.getAgingByTicket, body);
    return res;
  }

  getTicketsIssued(body){
    const res = AxiosServices.post(endpoints.ticket.getTicketsIssued, body);
    return res;
  }

  delIssuedTicket(id){
    const res = AxiosServices.delete(`${endpoints.ticket.delIssuedTicket}/${id}`);
    return res;
  }

  searchTicket(body){
    const res = AxiosServices.post(endpoints.ticket.searchTicket, body);
    return res;
  }

  payTicket(body){
    const res = AxiosServices.post(endpoints.ticket.payTicket, body);
    return res;
  }

  getTicketsByOrg(body){
    const res = AxiosServices.post(endpoints.ticket.getTicketsByOrg, body);
    return res;
  }

  IssueTicket(body){
    const res = AxiosServices.post(endpoints.ticket.IssueTicket, body);
    return res;
  }

  getTicketsIssuedByAgent(body){
    const res = AxiosServices.post(endpoints.ticket.getTicketsIssuedByAgent, body);
    return res;
  }
}
const ticketServices = new TicketServices();
export default ticketServices;
