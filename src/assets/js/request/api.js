import requset from './http'

export const apiPOST = params => requset('post','/public/user/login', params);