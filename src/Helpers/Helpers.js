import { config } from "../Constants";
import Papa from 'papaparse'
var CryptoJS = require("crypto-js");

export class Helpers {  
    
    getLang(){
        var userLanguage = window.navigator.userLanguage || window.navigator.language;
        return userLanguage.split('-')[0];
    }

    getSheetData =async (language) => {
        return new Promise((resolve, reject) => {
            Papa.parse(config.url.SHEET_URL, {
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
}

const helpers = new Helpers();
export default helpers;