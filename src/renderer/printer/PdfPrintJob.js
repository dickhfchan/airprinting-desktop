import relay from './relay'

export default class PdfPrintJob {
    constructor(pdfFilePath){
        this._pdfFilePath = pdfFilePath;
    }

    init(){
        return new Promise((resolve, reject) => {
            var opt = {};
            opt[relay.constants.printJobInfo.pdfFilePath] = this.pdfFilePath;

            relay.getPdfPrintJobInfo(opt).then(job => {
                this._pdfFilePath = job[relay.constants.printJobInfo.pdfFilePath];
                this._range = job[relay.constants.printJobInfo.range];
                this._printerName = job[relay.constants.printJobInfo.printerName];
                this._paperSize = job[relay.constants.printJobInfo.paperSize];
                this._duplex = job[relay.constants.printJobInfo.duplex];
                this._color = job[relay.constants.printJobInfo.color];
                this._pageCount = job[relay.constants.printJobInfo.pageCount];
                this._documentName = job[relay.constants.printJobInfo.documentName];

                resolve();
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    get pdfFilePath(){
        return this._pdfFilePath;
    }

    get printerName(){
        return this._printerName;
    }

    set printerName(val){
        this._printerName = val;
    }

    get documentName(){
        return this._documentName;
    }

    set documentName(val){
        this._documentName = val;
    }

    get paperSize(){
        return this._paperSize;
    }

    set paperSize(val){
        this._paperSize = val;
    }

    get duplex(){
        return this._duplex;
    }

    set duplex(val){
        this._duplex = val;
    }

    get color(){
        return this._color;
    }

    set color(val){
        this._color = val;
    }

    get range(){
        return this._range;
    }

    set range(val){
        this._range = val;
    }

    get pageCount(){
        return this._pageCount;
    }

    print(){
        var opt = {};
        opt[relay.constants.printJobInfo.pdfFilePath] = this.pdfFilePath;
        opt[relay.constants.printJobInfo.printerName] = this.printerName;
        opt[relay.constants.printJobInfo.documentName] = this.documentName;
        opt[relay.constants.printJobInfo.range] = this.range;
        opt[relay.constants.printJobInfo.color] = this.color;
        opt[relay.constants.printJobInfo.duplex] = this.duplex;
        opt[relay.constants.printJobInfo.paperSize] = this.paperSize;
        return relay.printPdf(opt);
    }
}
