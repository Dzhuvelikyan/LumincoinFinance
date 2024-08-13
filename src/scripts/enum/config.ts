export enum Config {
    //параметры для запросов
    api = 'http://localhost:3000/api',
    signupUrl = '/signup',
    loginUrl = '/login',
    refreshTokenURL = '/refresh',
    categoriesIncomeURL = '/categories/income',//запрос на доходы
    categoriesExpenseURL = '/categories/expense',//запрос на расходы
    operationsURL = '/operations',//запрос на операцию(расход\доход)
    balanceURL = '/balance',

    //query-параметры для запросов
    UTMPeriod = 'period',
    UTMDateFrom = 'dateFrom',
    UTMDateTo = 'dateTo',





    //параметры аутентификационных данных
    accessTokenKey = 'accessToken',
    refreshTokenKey = 'refreshToken',
    userInfoTokenKey = 'userInfo',

    //параметры для фильтрации
    DEFAULT_FILTER ='/?filter=today',
    UTMFilter = 'filter',//query-параметр для фильтрации



    //остальные параметры
    currency = '$',

}