import moment from "moment";
import { config } from "../Constants";
import Papa from 'papaparse'
var CryptoJS = require("crypto-js");

export class Helpers {
    
    getLang(){
        var userLanguage = window.navigator.userLanguage || window.navigator.language;
        return userLanguage.split('-')[0];
    }

    getSheetData =async (language, literal_sheet_url) => {
        console.log(literal_sheet_url)
        return new Promise((resolve, reject) => {
            Papa.parse(literal_sheet_url || config.url.SHEET_URL, {
                download: true,
                header: true,
                complete: async (res) => {
                    let result = await this.mapLanguages(language, res.data);   
                    resolve(result)
                },
                error (err) {
                reject(err)
                }
            });
        })
    }
  
    mapLanguages(language, sheetData){
        let literals = {};
        sheetData.forEach((item)=>{        
            if(item[language] !== undefined || item[language?.split('-')[0]] !== undefined){
                literals[item.key] = item[language] || item[language.split('-')[0]];
            }else{
                literals[item.key] = item['en'];
            }
        })
        return literals;
    }

    createFormData(formData,inputData) {
        Object.keys(inputData).forEach(fieldName => {
          formData.append(fieldName, inputData[fieldName]);
        })
        return formData
    }

    abilityByModuleKey(key){
        const isAdmin = JSON.parse(sessionStorage.getItem('userLogged'));
        let permission = isAdmin?.result?.permissions?.filter(x=>x.module.key == key);
        return permission[0];
    }

    crypto_decrypt(ciphertext){
        var bytes  = CryptoJS.AES.decrypt(ciphertext, config.constant.cryptoKey);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    }

    showDiff(added_date){
        var date1 = moment().toDate();    
        var date2 = moment(added_date, 'MMMM Do YYYY, hh:mm a').add(1,"m").toDate();
        //Customise date2 for your required future time
    
        var diff = (date2 - date1)/1000;
        var diff = Math.abs(Math.floor(diff));
    
        var days = Math.floor(diff/(24*60*60));
        var leftSec = diff - days * 24*60*60;
    
        var hrs = Math.floor(leftSec/(60*60));
        var leftSec = leftSec - hrs * 60*60;
    
        var min = Math.floor(leftSec/(60));
        var leftSec = leftSec - min * 60;
        days = (days == 0) ? '' : (days + "d ");
        hrs = (hrs == 0) ? '' : (hrs + "h ");
        min = (min == 0) ? '' : (min + "min ");
        return days + hrs + min;
      }
    
      calculateDay(added_date){
        var fromNow = moment(added_date ).fromNow();    
          return moment(added_date).calendar( null, {
              lastWeek: '[Last] dddd',
              lastDay:  '[Yesterday]',
              sameDay:  '[Today]',
              nextDay:  '[Tomorrow]',
              nextWeek: 'dddd',             
              sameElse: function () {
                  return "[" + fromNow + "]";
              }
          });
      }
}

const helpers = new Helpers();
export default helpers;