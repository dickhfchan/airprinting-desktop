import relay from './relay'

export default class Printer {
    constructor(printerName){
        this._printerName = printerName;
    }

    get printerName(){
        return this._printerName;
    }

    get paperSizes(){
        return this._paperSizes;
    }

    get supportsColor(){
        return this._supportsColor;
    }

    get canDuplex(){
        return this._canDuplex;
    }

    get resolutions(){
        return this._resolutions;
    }

    get isDefaultPrinter(){
        return this._isDefaultPrinter;
    }

    init(){
        return new Promise((resolve, reject) => {
            relay.getPrinterInfo(this._printerName).then(info => {
                this._printerName = info[relay.constants.printerInfo.name];
                this._supportsColor = info[relay.constants.printerInfo.supportsColor];
                this._paperSizes = info[relay.constants.printerInfo.paperSizes];
                this._canDuplex = info[relay.constants.printerInfo.canDuplex];
                this._resolutions = info[relay.constants.printerInfo.resolutions];
                this._isDefaultPrinter = info[relay.constants.printerInfo.isDefaultPrinter];

                resolve();
            })
            .catch(err => reject(err));
        });
    }

    static getInstalledPrinterNames(){
        return relay.getAllInstalledPrinterNames();
    }

    static getDefaultPrinterName(){
        return relay.getDefaultPrinterName();
    }

    static async getInstalledPrinters() {
      const names = await Printer.getInstalledPrinterNames()
      const printers = []
      for (const name of names) {
        const printer = new Printer(name)
        await printer.init()
        printers.push({
          name,
          color: printer.supportsColor,
          duplex: printer.canDuplex,
          sizes: printer.paperSizes,
        })
      }
      return printers
    }
}
