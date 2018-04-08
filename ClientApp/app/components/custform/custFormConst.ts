export class CustformConstructor {

    constructor(
        public id: number,
        public userId: string,
        public custFName: string,
        public custLName: string,
        public street: string,
        public city: string,
        public state: string,
        public zip: string,
        public email: string,
        public phone: string,
        public appoint: string,
        public appointDate: string,
        public appointTime: string,
        public modifiedBy: string,
        public compName: string,
        public compEmail: string,
      ) { }
    }