let baseUrl = ''
switch (process.env.NODE_ENV){
  case 'development':
    baseUrl = 'https://eapis.axonomy.pro'
    break;
  case 'production':
    baseUrl = 'https://defi.axonomy.pro'
    break;
}

export default baseUrl