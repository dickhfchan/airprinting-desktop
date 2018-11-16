var Printer = require("./Printer.js");
var PdfPrintJob = require("./PdfPrintJob.js");
var PrintStatus = require("./PrintStatus.js");

async function test(){
    // get name of all installed printers
    const printerNames = await Printer.getInstalledPrinterNames();
    console.log("installed printers:");
    console.log("  " + printerNames.join(", "));
    console.log("");

    // get name of default printer
    const defaultPrinterName = await Printer.getDefaultPrinterName();
    console.log("default printer:");
    console.log("  " + defaultPrinterName);
    console.log("");

    // get info of default printer
    const defaultPrinter = new Printer(defaultPrinterName);
    await defaultPrinter.init();
    console.log("info of default printer:");
    console.log("  Name: " + defaultPrinter.printerName);
    console.log("  Support color: " + defaultPrinter.supportsColor);
    console.log("  Support duplex: " + defaultPrinter.canDuplex); // support double sided
    console.log("  Paper sizes: " + defaultPrinter.paperSizes.join(", "));
    console.log("");

    // print a pdf
    const pdfFileName = "test.pdf";
    const job = new PdfPrintJob(pdfFileName);
    await job.init();
    console.log("There are " + job.pageCount + " pages in " + job.pdfFilePath);
    job.printerName = defaultPrinterName;   // change printer
    job.range = "2-3";  // change print range to page 2-3 only
                        // if you want to print all, set job.range="all";
    job.duplex = true;  // double sided
    job.paperSize = "A4";   // paper size
                            // make sure the paper size is supported by the selected printer
    await job.print();
    console.log("trigged the printing job");
    console.log("document name is " + job.documentName);

    // check printing status
    while (true){
        const status = new PrintStatus(job.printerName, job.documentName);
        await status.init();
        if (status.completed || status.deleted || status.printed){
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));    // sleep 1s
    }
    console.log("printed successfully");
}

test();
