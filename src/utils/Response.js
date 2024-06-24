export class ResponseModel {
    constructor(status, code, data, message){ 
        this.status = status;
        this.code = code;
        this.data = data;
        this.message = message;
    }

    static success( data = null, message = 'OK', code = 200 ){
        return new ResponseModel('success', code, data, message);
    }
    
    static error( message = 'Ha ocurrido un error!', code = 500, details = null){
        return new ResponseModel('error', code, {details}, message );
    }
}