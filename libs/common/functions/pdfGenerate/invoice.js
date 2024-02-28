const PDFDocument = require("pdfkit");
const path = require('path');
const {
    Base64Encode
} = require('base64-stream');
const {
    imageUpload
} = require('../file/index')

async function generateInvoicePdf(invoice, fileName) {
    return new Promise((resolve, reject) => {
        let {
            ClientInfo,
            objInvoice,
            CompanyInfo,
            InvoiceItems,
            objCompanyBankAcc,
            VehicleInfo
        } = invoice;

        let doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        let fileBase64 = '';
        generateHeader(doc, CompanyInfo);
        generateCustomerInformation(doc, ClientInfo, VehicleInfo);
        generateInvoiceTable(doc, InvoiceItems, objInvoice, objCompanyBankAcc);
        generateFooter(doc);

        const stream = doc.pipe(new Base64Encode());
        doc.end();

        stream.on('data', function (chunk) {
            fileBase64 += chunk;
        });

        stream.on('end', async function () {
            try {
                let location = await imageUpload(fileBase64, 'INVOICE', fileName);
                resolve(location);
            } catch (error) {
                reject(error);
            }
        });
    });
}

function generateHeader(doc, CompanyInfo) {
    doc
        .image(path.join(__dirname, `logo.png`), 50, 45, {
            width: 50
        })
        .fillColor("#444444")
        .fontSize(20)
        .text(CompanyInfo.strName, 110, 57)
        .fontSize(10)
        .text(CompanyInfo.strGST, 200, 65, {
            align: "right"
        })
        .text(CompanyInfo.strContact, 200, 75, {
            align: "right"
        })
        .text(CompanyInfo.strAddress, 200, 85, {
            align: "right"
        })
        .text(CompanyInfo.strPlace, 200, 95, {
            align: "right"
        })
        .moveDown();
}

function generateCustomerInformation(doc, ClientInfo) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice no:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(ClientInfo.bookingNumber, 150, customerInformationTop)
        .font("Helvetica")
        .text("Booking Type:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(ClientInfo.bookingType, 150, customerInformationTop+15)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 30)
        .text(ClientInfo.invoiceDate, 150, customerInformationTop + 30)
        .font("Helvetica-Bold")
        .text("Customer Name:", 50, customerInformationTop + 45)
        .text(ClientInfo.strClientName, 150, customerInformationTop+45)
        .font("Helvetica")
        .text("Contact No:", 50, customerInformationTop + 65)
        .text(ClientInfo.strClientContact, 150, customerInformationTop + 65)
        .text("Address:", 50, customerInformationTop + 85)
        .text(
            ClientInfo.strAddress,
            150,
            customerInformationTop + 85
        )
        .moveDown();

    generateHr(doc, 300);
}

function generateInvoiceTable(doc, InvoiceItems, objInvoice, objCompanyBankAcc) {
    let i;
    const invoiceTableTop = 350;

    doc.font("Helvetica-Bold");
    generateTableRow({
        doc: doc,
        y: invoiceTableTop,
        item: "Services",
        Rate: "Rate",
        discount: "Discount",
        lineTotal: "Line Total"
    }
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < InvoiceItems.length; i++) {
        const item = InvoiceItems[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow({
            doc: doc,
            y: position,
            item: item.strServiceName,
            Rate: item.intPricePerItem,
            discount: item.intDiscount,
            lineTotal: formatCurrency(Number(item.intSubAmt) || 0)
        });

        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow({
        doc,
        y: subtotalPosition,
        intCGST: "Subtotal",
        lineTotal: formatCurrency(Number(objInvoice.intSubTotal) || 0)
    });

    const paidToDatePosition = subtotalPosition + 20;
    // generateTableRow({
    //     doc,
    //     y: paidToDatePosition,
    //     intCGST: "Paid To Date",
    //     lineTotal: formatCurrency(Number(objInvoice.intTotalPayAmt) || 0)
    // });

    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    // generateTableRow({
    //     doc,
    //     y: duePosition,
    //     intCGST: "Balance Due",
    //     lineTotal: formatCurrency(Number(objInvoice.intSubTotal - objInvoice.intTotalPayAmt) || 0)
    // });

    doc.font("Helvetica");
    generateTableRow({
        doc,
        y: duePosition + 25 + 40,
        item: "Amount Chargeable (in words)",
    });
    doc.font("Helvetica-Bold");
    generateTableRow({
        doc,
        y: duePosition + 25 + 40 + 10,
        item: objInvoice.strTotalInWords,
    });

    doc.font("Helvetica-Bold");
    generateTableRow({
        doc,
        y: duePosition + 25 + 40 + 10 + 40,
        item: `Company’s Bank Details  `
    });
    generateTableRow({
        doc,
        y: duePosition + 25 + 40 + 10 + 40 + 10,
        item: `A/c Holder’s Name     : ${objCompanyBankAcc.strAccHolder || ''}`
    });
    generateTableRow({
        doc,
        y: duePosition + 25 + 40 + 10 + 40 + 25,
        item: `A/c No.                     : ${objCompanyBankAcc.strAccNo || ''}`
    });
    // generateTableRow({
    //     doc,
    //     y: duePosition + 25 + 40 + 10 + 40 + 35,
    //     item: `   : ${objCompanyBankAcc.strIFC || ''}`
    // });
}

function generateFooter(doc) {
    doc

        // .image(path.join(__dirname, "signature_sample.png"), 50, 500, {
        //     width: 50,
        //     align: "left"
        // })
        .fontSize(10)
        .text(
            "Thank you.This is a Computer Generated Invoice",
            50,
            750, {
            align: "center"
        }
        )


}

function generateTableRow({
    doc,
    y,
    item = '',
    Rate = '',
    discount = '',
    intCGST = '',
    intSGST = '',
    lineTotal = '',
    fontSize = 10
}) {
    doc
        .fontSize(fontSize)
        .text(item, 50, y)
        .text(Rate, 230, y, {
            width: 80,
            align: "right"
        })
        .text(discount, 280, y, {
            width: 80,
            align: "right"
        })
        .text(intCGST, 330, y, {
            width: 60,
            align: "right"
        })
        .text(intSGST, 360, y, {
            width: 60,
            align: "right"
        })
        .text(lineTotal, 0, y, {
            align: "right"
        });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(val) {
    return (val).toFixed(2);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}

module.exports = {
    generateInvoicePdf
};