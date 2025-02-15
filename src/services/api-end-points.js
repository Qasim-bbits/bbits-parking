import { config } from '../Constants';
export const endpoints = {

  ///---Common service--///

  common : {
    get_record : config.url.API_URL + 'get_record',
    save_record : config.url.API_URL + 'save_record',
    edit_record : config.url.API_URL + 'edit_record',
    del_record : config.url.API_URL + 'del_record',
    get_record_by_id : config.url.API_URL + 'get_record_by_id',
    sendMail : config.url.API_URL + 'sendMail',
  },

  
  ///---Login service--///

  auth : {
      signup : config.url.API_URL + 'signup',
      login : config.url.API_URL + 'login',
      resend : config.url.API_URL + 'resend',
      resetPassword : config.url.API_URL + 'resetPassword',
      verify : config.url.API_URL + 'verify',
      adminLogin : config.url.API_URL + 'adminLogin',
      editPassword : config.url.API_URL + 'editPassword',
      forgetPassword : config.url.API_URL + 'forgetPassword',
      changePassword : config.url.API_URL + 'changePassword',
      agentLogin : config.url.API_URL + 'agent_login',
  },

  ///---Home service--///

  main : {
      getCities : config.url.API_URL + 'getCities',
      getZonesById : config.url.API_URL + 'getZonesById',
      getPlatesByUser : config.url.API_URL + 'getPlatesByUser',
      addPlate : config.url.API_URL + 'addPlate',
      delPlate : config.url.API_URL + 'delPlate',
      editPlate : config.url.API_URL + 'editPlate',
      getRateById : config.url.API_URL + 'getRateById',
      getRateSteps : config.url.API_URL + 'getRateSteps',
      getZonebyId : config.url.API_URL + 'getZonebyId',
      getQRRateById : config.url.API_URL + 'getQRRateById',
      emailReciept : config.url.API_URL + 'emailReciept',
      getUserHistory : config.url.API_URL + 'getUserHistory',
      getZones : config.url.API_URL + 'getZones',
      getUserProfile : config.url.API_URL + 'getUserProfile',
      editProfile : config.url.API_URL + 'editProfile',
      getCurrentParkingsByPlate : config.url.API_URL + 'getCurrentParkingsByPlate',
      getCurrentParking : config.url.API_URL + 'getCurrentParking',
      addVisitor : config.url.API_URL + 'addVisitor',
  },

  ///---Category service--///

  dashboard : {
    getDashboard : config.url.API_URL + 'getDashboard',
    addDashboard : config.url.API_URL + 'addDashboard',
    editDashboard : config.url.API_URL + 'editDashboard',
  },

  ///---Parking service--///

  parking : {
    buyParking : config.url.API_URL + 'buyParking',
    getParkings : config.url.API_URL + 'getParkings',
    buyVisitorPass : config.url.API_URL + 'buyVisitorPass',
    resetParkingLimit : config.url.API_URL + 'resetParkingLimit',
    getParkingsByCity : config.url.API_URL + 'getParkingsByCity',
    editParking : config.url.API_URL + 'editParking',
    kickOutPlate : config.url.API_URL + 'kickOutPlate',
    exitParking : config.url.API_URL + 'exitParking',
  },

  ///---User service--///

  user : {
    getUsers : config.url.API_URL + 'getUsers',
    delUser : config.url.API_URL + 'delUser',
    addUser : config.url.API_URL + 'addUser',
    editUser : config.url.API_URL + 'editUser',
    getAgents : config.url.API_URL + 'getAgents',
  },

  ///---Plates service--///
  
  plates : {
    getBusinessPlate : config.url.API_URL + 'getBusinessPlate',
    addBusinessPlate : config.url.API_URL + 'addBusinessPlate',
    delBusinessPlate : config.url.API_URL + 'delBusinessPlate',
  },

   ///---Tenent Plates service--///
  
   tenant_plates : {
    getTenantPlates : config.url.API_URL + 'getTenantPlates',
    editTenentPlate : config.url.API_URL + 'editTenentPlate',
    addTenentPlate : config.url.API_URL + 'addTenentPlate',
    delTenentPlate : config.url.API_URL + 'delTenentPlate',
  },

  ///---Business Pass Plates service--///
  
  business_pass_plates : {
    getBusinessPassPlates : config.url.API_URL + 'getBusinessPassPlates',
    editBusinessPassPlates : config.url.API_URL + 'editBusinessPassPlate',
    addBusinessPassPlates : config.url.API_URL + 'addBusinessPassPlate',
    delBusinessPassPlates : config.url.API_URL + 'delBusinessPassPlate',
  },

   ///---Tenent Plates service--///
  
   residant_plates : {
    getResidantPlates : config.url.API_URL + 'getResidantPlates',
    editResidantPlate : config.url.API_URL + 'editResidantPlate',
    addResidantPlate : config.url.API_URL + 'addResidantPlate',
    delResidantPlate : config.url.API_URL + 'delResidantPlate',
  },

  ///---City and Zone service--///

  city : {
    addCity : config.url.API_URL + 'addCity',
    editCity : config.url.API_URL + 'editCity',
    delCity : config.url.API_URL + 'delCity',
    addZone : config.url.API_URL + 'addZone',
    getCities : config.url.API_URL + 'getCities',
    getZones : config.url.API_URL + 'getZones',
    editZone : config.url.API_URL + 'editZone',
    delZone : config.url.API_URL + 'delZone',
    getVisitorZone : config.url.API_URL + 'getVisitorZone',
    getTenantAndVisitorZones : config.url.API_URL + 'tenantVisitorZones',
  },

  ///---Rate service--///

  rate : {
    getRateDetail : config.url.API_URL + 'getRateDetail',
    editRateType : config.url.API_URL + 'editRateType',
    bulkEditSteps : config.url.API_URL + 'bulkEditSteps',
    addCompleteRate : config.url.API_URL + 'addCompleteRate',
    addSpecialRate : config.url.API_URL + 'addSpecialRate',
    getRateByZone : config.url.API_URL + 'getRateByZone',
    delRateType : config.url.API_URL + 'delRateType',
    visitorPassRate : config.url.API_URL + 'visitorPassRate',
  },

  ///---Organization service--///

  organization : {
    addOrganization : config.url.API_URL + 'addOrganization',
    editOrganization : config.url.API_URL + 'editOrganization',
    delOrganization : config.url.API_URL + 'delOrganization',
    getOrganizations : config.url.API_URL + 'getOrganizations',
    getOrgBySubDomain : config.url.API_URL + 'getOrgBySubDomain',
    getOrgImage : config.url.API_URL + 'getOrgImage',
  },

  ///---Module service--///

  module : {
    addModule : config.url.API_URL + 'addModule',
    editModule : config.url.API_URL + 'editModule',
    delModule : config.url.API_URL + 'delModule',
    getModules : config.url.API_URL + 'getModules',
  },

  ///---ScanPlate service--///

  scanPlates : {
    addScanPlate : config.url.API_URL + 'addScanPlate',
    getScanPlates : config.url.API_URL + 'getScanPlates',
    delScanPlate : config.url.API_URL + 'delScanPlate'
  },

  ///---Ticket service--///

  ticket : {
    addTicket : config.url.API_URL + 'addTicket',
    editTicket : config.url.API_URL + 'editTicket',
    delTicket : config.url.API_URL + 'delTicket',
    getTickets : config.url.API_URL + 'getTickets',
    getAgingByTicket : config.url.API_URL + 'getAgingByTicket',
    getTicketsIssued : config.url.API_URL + 'getTicketsIssued',
    delIssuedTicket : config.url.API_URL + 'delIssuedTicket',
    searchTicket : config.url.API_URL + 'searchTicket',
    payTicket : config.url.API_URL + 'payTicket',
    getTicketsByOrg : config.url.API_URL + 'getTicketsByOrg',
    IssueTicket : config.url.API_URL + 'IssueTicket',
    getTicketsIssuedByAgent : config.url.API_URL + 'getTicketsIssuedByAgent',
  },

  ///---Permissions service--///

  permission : {
    addPermission : config.url.API_URL + 'addPermission',
    editPermission : config.url.API_URL + 'editPermission',
    delPermission : config.url.API_URL + 'delPermission',
    getPermissions : config.url.API_URL + 'getPermissions',
    getUserPermissions : config.url.API_URL + 'getUserPermissions',
    getModulePermissions : config.url.API_URL + 'getModulePermissions',
    getAgentPermissions : config.url.API_URL + 'getAgentPermissions',
  },

  
  ///---externalParkingConfig service--///

  externalParkingConfig : {
    getExternalParkingConfig : config.url.API_URL + 'getExternalParkingConfig',
    getZoneByOrg : config.url.API_URL + 'getZoneByOrg',
    addExternalParkingConfig : config.url.API_URL + 'addExternalParkingConfig',
    editExternalParkingConfig : config.url.API_URL + 'editExternalParkingConfig',
    delExternalParkingConfig : config.url.API_URL + 'delExternalParkingConfig',
  },

  ///---moneris service--///

  moneris : {
    generateToken : config.url.API_URL + 'generateToken',
    monerisReceipt : config.url.API_URL + 'monerisReceipt',
  },

  ///---reporting service--///

  reporting : {
    getAllKeys : config.url.API_URL + 'getAllKeys',
    generateReport : config.url.API_URL + 'generateReport',
    exportPDF : config.url.API_URL + 'exportPDF',
    generateTicketIssuedReport : config.url.API_URL + 'generateTicketIssuedReport',
  },

  kickOutPlate : {
    getKickOutPlates : config.url.API_URL + 'getKickOutPlates',
  },
}