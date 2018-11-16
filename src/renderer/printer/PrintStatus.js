import relay from './relay'

export default class PrintStatus {
    constructor(printerName, documentName){
        this._printerName = printerName;
        this._documentName = documentName;
    }

    get printerName(){
        return this._printerName;
    }

    get documentName(){
        return this._documentName;
    }

    get blocked(){
        return this._blocked;
    }

    get completed(){
        return this._completed;
    }

    get deleted(){
        return this._deleted;
    }

    get deleting(){
        return this._deleting;
    }

    get error(){
        return this._error;
    }

    get none(){
        return this._none;
    }

    get offline(){
        return this._offline;
    }

    get paperOut(){
        return this._paperOut;
    }

    get paused(){
        return this._paused;
    }

    get printed(){
        return this._printed;
    }

    get printing(){
        return this._printing;
    }

    get restarted(){
        return this._restarted;
    }

    get retained(){
        return this._retained;
    }

    get spooling(){
        return this._spooling;
    }

    get userIntervention(){
        return this._userIntervention;
    }

    init(){
        return new Promise((resolve, reject) => {
            relay.getPrintStatusInfo(this._printerName, this._documentName).then(info => {
                this._blocked = info[relay.constants.printStatusInfo.blocked];
                this._completed = info[relay.constants.printStatusInfo.completed];
                this._deleted = info[relay.constants.printStatusInfo.deleted];
                this._deleting = info[relay.constants.printStatusInfo.deleting];
                this._error = info[relay.constants.printStatusInfo.error];
                this._none = info[relay.constants.printStatusInfo.none];
                this._offline = info[relay.constants.printStatusInfo.offline];
                this._paperOut = info[relay.constants.printStatusInfo.paperOut];
                this._paused = info[relay.constants.printStatusInfo.paused];
                this._printed = info[relay.constants.printStatusInfo.printed];
                this._printing = info[relay.constants.printStatusInfo.printing];
                this._restarted = info[relay.constants.printStatusInfo.restarted];
                this._retained = info[relay.constants.printStatusInfo.retained];
                this._spooling = info[relay.constants.printStatusInfo.spooling];
                this._userIntervention = info[relay.constants.printStatusInfo.ruserIntervention];


                resolve();
            })
            .catch(err => reject(err));
        });
    }
}
