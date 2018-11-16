import edge from 'electron-edge-js'
const path = require('path');

const Constants = {
    printJobInfo: {
        printerName: "PrinterName",
        pdfFilePath: "PdfFilePath",
        paperSize: "PaperSize",
        color: "Color",
        duplex: "Duplex",
        range: "Range",
        pageCount: "PageCount",
        documentName: "DocumentName",
    },
    printerInfo: {
        name: "Name",
        resolutions: "Resolutions",
        canDuplex: "CanDuplex",
        supportsColor: "SupportsColor",
        paperSizes: "PaperSizes",
        isDefaultPrinter: "IsDefaultPrinter"
    },
    printStatusInfo: {
        printerName: "PrinterName",
        documentName: "DocumentName",
        blocked: "Blocked",
        completed: "Completed",
        deleted: "Deleted",
        deleting: "Deleting",
        error: "Error",
        none: "None",
        offline: "Offline",
        paperOut: "PaperOut",
        paused: "Paused",
        printed: "Printed",
        printing: "Printing",
        restarted: "Restarted",
        retained: "Retained",
        spooling: "Spooling",
        UserIntervention: "UserIntervention"
    }
};

const Helper = {
    constants: Constants,

    getAllInstalledPrinterNames: () => new Promise((resolve, reject) => {
        const dnet = edge.func(`
#r "${path.join(__dirname, 'PrinterHelper.dll')}"

using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using PrinterHelper;

public class Startup
{
    public async Task<object> Invoke(object input)
    {
        return Array.ConvertAll(PrinterHelper.Printer.InstalledPrinters, p => p.Name);
    }
}
        `);

        dnet(null, (err, result) => {
            if (err){
                return reject(err);
            }
            resolve(result);
        });
    }),

    getPrinterInfo: printerName => new Promise((resolve, reject) => {
        const dnet = edge.func(`
#r "${path.join(__dirname, 'PrinterHelper.dll')}"

using System;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Collections.Generic;
using PrinterHelper;

public class Startup
{
    public async Task<object> Invoke(object input)
    {
        var printerName = (string)input;
        var printer = PrinterHelper.Printer.GetPrinterByName(printerName);
        if (printer == null){
            return null;
        }

        var expando = new ExpandoObject();
        var dictionary = (IDictionary<string, object>)expando;

        foreach (var property in printer.GetType().GetProperties()){
            if (property.GetAccessors(true)[0].IsStatic){
                // skip all static properties
                continue;
            }

            string key = property.Name;
            object val = property.GetValue(printer);

            if (key == "PaperSizes"){
                val = Array.ConvertAll(printer.PaperSizes, s => s.Name);
            }
            else if (key == "Resolutions"){
                val = Array.ConvertAll(printer.Resolutions, s => s.Name);
            }

            dictionary.Add(key, val);
        }

        return expando;
    }
}
        `);

        dnet(printerName, (err, result) => {
            if (err){
                return reject(err);
            }
            resolve(result);
        });
    }),

    getDefaultPrinterName: ()=> new Promise((resolve, reject) => {
        const dnet = edge.func(`
#r "${path.join(__dirname, 'PrinterHelper.dll')}"

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using PrinterHelper;

public class Startup
{
    public async Task<object> Invoke(object input)
    {
        var printer = PrinterHelper.Printer.DefaultPrinter;
        return printer.Name;
    }
}
        `);

        dnet(null, (err, result) => {
            if (err){
                return reject(err);
            }
            resolve(result);
        });
    }),

    printPdf: param => new Promise((resolve, reject) => {
        const dnet = edge.func(`
#r "${path.join(__dirname, 'PrinterHelper.dll')}"

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using PrinterHelper;

public class Startup
{
    public async Task<object> Invoke(object input)
    {
        dynamic param = input;

        Func<string, bool> paramHasProperty = key => {
            return ((IDictionary<string, object>)param).ContainsKey(key);
        };

        var job = new PrinterHelper.PdfPrintJob(param.PdfFilePath);

        if (paramHasProperty("PrinterName")){
            job.PrinterName = param.PrinterName;
        }

        var printer = PrinterHelper.Printer.GetPrinterByName(job.PrinterName);
        if (printer == null){
            throw new Exception("unknown printer " + job.PrinterName);
        }

        if (paramHasProperty("Color")){
            job.Color = param.Color;
        }

        if (paramHasProperty("PaperSize")){
            var selected = Array.Find(printer.PaperSizes, s => s.Name == param.PaperSize);
            if (selected == null){
                throw new Exception("unknown paperSizeName " + param.PaperSizeName);
            }
            job.PaperSize = selected;
        }

        if (paramHasProperty("Duplex")){
            job.Duplex = param.Duplex ? PrinterHelper.DuplexEnum.Vertical : PrinterHelper.DuplexEnum.Simplex;
        }

        if (paramHasProperty("Range")){
            var str = param.Range;
            if (str == "all"){
                job.Range = new PrinterHelper.PrintRange.All();
            }
            else {
                var tokens = str.Split('-');
                job.Range = new PrinterHelper.PrintRange.Range(){
                    From = int.Parse(tokens[0]),
                    To = int.Parse(tokens[1]),
                };
            }
        }

        if (paramHasProperty("DocumentName")){
            job.DocumentName = param.DocumentName;
        }

        job.Print();
        return true;
    }
}
        `);

        dnet(param, (err, result) => {
            if (err){
                return reject(err);
            }
            resolve(result);
        });
    }),

    getPdfPrintJobInfo: param => new Promise((resolve, reject) => {
        const dnet = edge.func(`
#r "${path.join(__dirname, 'PrinterHelper.dll')}"

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using PrinterHelper;

public class Startup
{
    public async Task<object> Invoke(object input)
    {
        dynamic param = input;

        Func<string, bool> paramHasProperty = key => {
            return ((IDictionary<string, object>)param).ContainsKey(key);
        };

        var job = new PrinterHelper.PdfPrintJob(param.PdfFilePath);

        if (paramHasProperty("PrinterName")){
            job.PrinterName = param.PrinterName;
        }

        var printer = PrinterHelper.Printer.GetPrinterByName(job.PrinterName);
        if (printer == null){
            throw new Exception("unknown printer " + job.PrinterName);
        }

        if (paramHasProperty("Color")){
            job.Color = param.Color;
        }

        if (paramHasProperty("PaperSize")){
            var selected = Array.Find(printer.PaperSizes, s => s.Name == param.PaperSize);
            if (selected == null){
                throw new Exception("unknown paperSizeName " + param.PaperSizeName);
            }
            job.PaperSize = selected;
        }

        if (paramHasProperty("Duplex")){
            job.Duplex = param.Duplex ? PrinterHelper.DuplexEnum.Vertical : PrinterHelper.DuplexEnum.Simplex;
        }

        if (paramHasProperty("Range")){
            var str = param.Range;
            if (str == "all"){
                job.Range = new PrinterHelper.PrintRange.All();
            }
            else {
                var tokens = str.Split('-');
                job.Range = new PrinterHelper.PrintRange.Range(){
                    From = int.Parse(tokens[0]),
                    To = int.Parse(tokens[1]),
                };
            }
        }

        if (paramHasProperty("DocumentName")){
            job.DocumentName = param.DocumentName;
        }

        return job;
    }
}
        `);

        dnet(param, (err, result) => {
            if (err){
                return reject(err);
            }

            // convert PaperSize
            result[Constants.printJobInfo.paperSize] = result[Constants.printJobInfo.paperSize]["Name"];

            // handle Range of all
            if (!result[Constants.printJobInfo.range].hasOwnProperty("From")){
                result[Constants.printJobInfo.range] = "all";
            }
            else {
                result[Constants.printJobInfo.range] = "" + result[Constants.printJobInfo.range]["From"] + "-" + result[Constants.printJobInfo.range]["To"];
            }

            // Duplex
            result[Constants.printJobInfo.duplex] = (result[Constants.printJobInfo.duplex] != "Simplex");

            resolve(result);
        });
    }),
    getPrintStatusInfo: (printerName, documentName) => new Promise((resolve, reject) => {
        const dnet = edge.func(`
#r "${path.join(__dirname, 'PrinterHelper.dll')}"

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using PrinterHelper;

public class Startup
{
    public async Task<object> Invoke(object input)
    {
        dynamic param = input;

        var status = new PrinterHelper.PrintStatus(param.PrinterName, param.DocumentName);

        return status;
    }
}
        `);

        const param = {};
        param[Constants.printStatusInfo.printerName] = printerName;
        param[Constants.printStatusInfo.documentName] = documentName;

        dnet(param, (err, result) => {
            if (err){
                return reject(err);
            }

            resolve(result);
        });
    })
}
export default Helper
