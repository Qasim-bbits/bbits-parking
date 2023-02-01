const prod = {
    url: {
        API_URL: 'https://bbits.solutions/api/',
        client_url: 'bbits.solutions/',
        http: 'https://',
        file_url: 'https://bbits.solutions/cwp_api/',
        Publishable_key: 'pk_live_51LNe7jLYWOUdDhrwJl17sstIOesT8fPjo6UgCdAg4YoCrXntI4wcrqqGiLoU53wRlitawyxTMNeprxL0a2anbSnW00Jn8XL3I1',
        SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTrC_EcFDpu0YM722BhD2x-nsvTiMNMx6AoMXS4LAtjkWA289GfUlrctrQM56AG0ULgYolkRJIk83-h/pub?gid=0&single=true&output=csv',
    },
    constant: {
        sub_domain_length: 2,
        cryptoKey: 'QaoRGp14gXs0vtw8VJke3WnO3-3t7Zr1r7tSj5Hp4FA'
    }
};
const dev = {
    url: {
        // API_URL: 'https://bbits.solutions/api/',
        // client_url: 'bbits.solutions/',
        // http: 'https://',
        // file_url: 'https://bbits.solutions/cwp_api/',
        API_URL: 'http://localhost:3001/' ,
        client_url: 'localhost:3000/',
        http: 'http://',
        file_url: 'http://localhost:3001/',
        Publishable_key: 'pk_test_51LNe7jLYWOUdDhrwbaAhDLSa7vS3q3l1FJGcuqxKjCyQEXeTrmrwV1gYIKA3ZDfOnesq4shVWKq5fMQGykGdeKcU008EFBRRAb',
        SHEET_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTrC_EcFDpu0YM722BhD2x-nsvTiMNMx6AoMXS4LAtjkWA289GfUlrctrQM56AG0ULgYolkRJIk83-h/pub?gid=0&single=true&output=csv',
    },
    constant: {
        sub_domain_length: 1,
        cryptoKey: 'QaoRGp14gXs0vtw8VJke3WnO3-3t7Zr1r7tSj5Hp4FA',
        // _hMacKey: "fVY@s5=@s4FSz7t$MDtQ*PA?",
        _hMacKey: "3WnO3-3t7Zr1r7tSj5Hp4FA",
        username: "integraTariffsPrePro",
        password: "TkbiY#D/q.",
    }
};

export const config = process.env.NODE_ENV === "development" ? dev : prod;