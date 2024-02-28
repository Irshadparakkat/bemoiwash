const PDFDocument = require("pdfkit");
const path = require('path');
const { Base64Encode } = require('base64-stream');
const { imageUpload } = require('../file/index');

async function generatePurchaseOrderPdf(purchaseOrder, fileName) {
    const {
        VendorInfo,
        objPurchaseOrder,
        CompanyInfo,
        PurchaseOrderItems,
    } = purchaseOrder;

    const doc = new PDFDocument({
        size: "A4",
        margin: 30
    });

    let fileBase64 = '';
    const stream = doc.pipe(new Base64Encode());

    generateHeader(doc, CompanyInfo);
    generateMainHeading(doc);
    generateVendorInformation(doc, VendorInfo);
    generatePurchaseOrderTable(doc, PurchaseOrderItems);
    generateTotalTable(doc, objPurchaseOrder);

    doc.end();

    await new Promise((resolve) => {
        stream.on('data', function (chunk) {
            fileBase64 += chunk;
        });

        stream.on('end', function () {
            resolve();
        });
    });

    await imageUpload(fileBase64, 'PURCHASE_ORDER', fileName);

    return fileBase64;
}

function generateHeader(doc, CompanyInfo) {
    doc
        .image(path.join(__dirname, `logo.png`), 50, 45, {
            width: 150
        })
        .fillColor("#444444")
        .fontSize(14)
        .text(CompanyInfo.strName, 210, 50)
        .fontSize(10)
        .text(CompanyInfo.strGST, 210, 65)
        .text(CompanyInfo.strContact, 210, 80)
        .text(CompanyInfo.strAddress, 210, 95)
        .text(CompanyInfo.strPlace, 210, 110)
        .moveDown();
}

function generateMainHeading(doc) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Purchase Order", 50, 180, { align: "center", width: 500 });
    generateHr(doc, 205);
}

function generateVendorInformation(doc, VendorInfo) {
    doc
        .fillColor("#444444")
        .fontSize(12)
        .text("Supplier Information", 50, 225);

    generateHr(doc, 240);

    doc
        .fontSize(10)
        .text("Purchase Order No:", 50, 260)
        .font("Helvetica-Bold")
        .text(VendorInfo.purchaseOrderNumber, 180, 260)
        .font("Helvetica")
        .text("Order Date:", 50, 275)
        .text(VendorInfo.orderDate, 180, 275)
        .text("Supplier Account:", 50, 290)
        .text(VendorInfo.vendorName, 180, 290)
        .text("Supplier Address:", 50, 305)
        .text(VendorInfo.vendorAddress, 180, 305)
        .moveDown();

    generateHr(doc, 335);
}

function generatePurchaseOrderTable(doc, PurchaseOrderItems) {
    const purchaseOrderTableTop = 370;
    const columnWidth = 80;

    doc.font("Helvetica-Bold");
    generateTableRow({
        doc: doc,
        y: purchaseOrderTableTop,
        item: "Item",
        quantity: "Quantity",
        unitPrice: "Unit Price",
        sgst: "SGST (%)",
        cgst: "CGST (%)",
        totalamt: "Total Price",
        columnWidth,
        alignRight: false // Align item names to the left
    });

    generateHr(doc, purchaseOrderTableTop + 20);
    doc.font("Helvetica");

    for (let i = 0; i < PurchaseOrderItems.length; i++) {
        const item = PurchaseOrderItems[i];
        const position = purchaseOrderTableTop + (i + 1) * 30;
        generateTableRow({
            doc: doc,
            y: position,
            item: item.strMaterial,
            quantity: item.intQuantity,
            unitPrice: formatCurrency(item.intPricePerUnit),
            sgst: `${item.intSGST}`,
            cgst: `${item.intCGST}`,
            totalamt: formatCurrency(item.intTotalAmt),
            columnWidth,
            alignRight: true // Align item values to the right
        });

        generateHr(doc, position + 20);
    }
}

function generateTotalTable(doc, objPurchaseOrder) {
    const totalTableTop = 550;
    const columnWidth = 100;

    doc.font("Helvetica-Bold");

    // Total Amount
    generateTableRow({
        doc: doc,
        y: totalTableTop,
        cgst: "Total",
        totalamt: formatCurrency(objPurchaseOrder.totalAmount),
        columnWidth,
        alignRight: true
    });

    // Paid Amount
    generateTableRow({
        doc,
        y: totalTableTop + 30,
        cgst: "Paid Amount",
        totalamt: formatCurrency(objPurchaseOrder.paidAmount),
        columnWidth,
        alignRight: true
    });

    // Balance Amount
    generateTableRow({
        doc,
        y: totalTableTop + 60,
        cgst: "Balance",
        totalamt: formatCurrency(objPurchaseOrder.balanceAmount),
        columnWidth,
        alignRight: true
    });
}

function generateTableRow({
    doc,
    y,
    item = '',
    quantity = '',
    unitPrice = '',
    sgst = '',
    cgst = '',
    totalamt = '',
    fontSize = 8,
    columnWidth = 80,
    alignRight = false
}) {
    if (alignRight) {
        const rightColumnX = 450; // Adjusted right column position
        doc
            .fontSize(fontSize)
            .text(item, 50, y, { width: columnWidth })
            .text(quantity, 100, y, { width: columnWidth, align: 'right' })
            .text(unitPrice, 160, y, { width: columnWidth, align: 'right' })
            .text(sgst, 220, y, { width: columnWidth, align: 'right' })
            .text(cgst, 280, y, { width: columnWidth, align: 'right' })
            .text(totalamt, rightColumnX, y, { width: columnWidth, align: 'right' });
    } else {
        doc
            .fontSize(fontSize)
            .text(item, 50, y, { width: columnWidth})
            .text(quantity, 100, y, { width: columnWidth, align: "right" })
            .text(unitPrice, 160, y, { width: columnWidth, align: "right" })
            .text(sgst, 220, y, { width: columnWidth, align: "right" })
            .text(cgst, 280, y, { width: columnWidth, align: "right" })
            .text(totalamt, 450, y, { width: columnWidth, align: "right" });
    }
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
    return (typeof val === 'number' && !isNaN(val)) ? val.toFixed(2) : '0.00';
}

module.exports = {
    generatePurchaseOrderPdf
};
