const PDFDocument = require("pdfkit");
const path = require('path');
const { Base64Encode } = require('base64-stream');
const { imageUpload } = require('../file/index');
const converter = require('number-to-words');

function generateSubContractPdf(subContract, fileName) {
    const doc = new PDFDocument({
        size: "A4",
        margin: 50
    });

    let fileBase64 = '';

    generateHeader(doc, subContract.CompanyInfo);
    generateContractInfo(doc, subContract.ContractInfo);
    generateTable(doc, 'Payment Details', [
        { label: 'Schedule Name:', value: subContract.objPaymentDetails.ScheduleName },
        { label: 'Total Sub Amount:', value: formatCurrency(subContract.objPaymentDetails.intTotalSubAmt) },
        { label: 'Total Pay Amount:', value: formatCurrency(subContract.objPaymentDetails.intTotalPayAmt) },
        { label: 'Balance Amount:', value: formatCurrency(subContract.objPaymentDetails.intBalanceAmt) },
        { label: 'Total in Words:', value: subContract.objPaymentDetails.strTotalInWords }
    ]);
    generateTable(doc, 'Company Bank Details', [
        { label: 'Account Holder:', value: subContract.objCompanyBankAcc.strAccHolder },
        { label: 'Bank Name:', value: subContract.objCompanyBankAcc.strBankName },
        { label: 'Account No.:', value: subContract.objCompanyBankAcc.strAccNo },
        { label: 'Branch & IFC:', value: subContract.objCompanyBankAcc.strIFC }
    ]);
    generateFooter(doc);

    const stream = doc.pipe(new Base64Encode());

    stream.on('data', function (chunk) {
        fileBase64 += chunk;
    });

    stream.on('end', async function () {
        await imageUpload(fileBase64, 'SUB_CONTRACT', fileName);
        return fileBase64;
    });

    doc.end();
}

function generateHeader(doc, CompanyInfo) {
    doc
        .image(path.join(__dirname, 'logo.png'), 50, 40, { width: 120 })
        .font('Helvetica-Bold').fontSize(16)
        .text(CompanyInfo.strName, 200, 40, { align: 'center' })
        .fontSize(10)
        .text(CompanyInfo.strGST, 200, 60, { align: 'center' })
        .text(CompanyInfo.strContact, 200, 75, { align: 'center' })
        .text(CompanyInfo.strAddress, 200, 90, { align: 'center' })
        .text(CompanyInfo.strPlace, 200, 105, { align: 'center' })
        .moveDown();
}

function generateContractInfo(doc, ContractInfo) {
    doc
        .fontSize(18).text('Subcontract Agreement', { align: 'center' }).moveDown()
        .fontSize(12)
        .text(`Contract No: ${ContractInfo.ContractNo}`)
        .text(`Contract Date: ${ContractInfo.ContractDate}`)
        .text(`Contractor: ${ContractInfo.strContractName}`)
        .text(`Project: ${ContractInfo.strProjectName}`)
        .text(`Address: ${ContractInfo.strAddress}`)
        .moveDown();
}

function generateTable(doc, title, rows) {
    doc
        .fontSize(16).text(title, { align: 'center' }).moveDown()
        .fontSize(12);

    const tableTop = doc.y;
    const tableBottom = tableTop + 20 + (rows.length * 20);

    doc.lineWidth(1).rect(50, tableTop, 500, tableBottom - tableTop).stroke();

    rows.forEach((row, index) => {
        doc
            .font('Helvetica-Bold')
            .text(row.label, 70, tableTop + 20 + (index * 20))
            .font('Helvetica')
            .text(row.value, 250, tableTop + 20 + (index * 20));
    });

    doc.moveDown();
}

function generateFooter(doc) {
    doc
        .fontSize(10).text('Thank you for choosing our services.', { width: 500, align: 'center' })
        .fontSize(8).text('This is a computer-generated document.', { width: 500, align: 'center' });
}

function formatCurrency(val) {
    return (val).toFixed(2);
}

module.exports = {
    generateSubContractPdf
};
