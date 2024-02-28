const {
    MongoClient
} = require("mongodb");
const fs = require('fs');
fs.readFile(__dirname + '/data.json', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    try {
        const objData = JSON.parse(data);
        let isClean = true;
        let Connection = await MongoClient.connect("mongodb://127.0.0.1:27017", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });
        const db = await Connection.db(objData.db);
        let objCollections = {};
        const arrCollections = await db.listCollections().toArray();
        await Promise.all(Object.keys(objData).map(async (strCollection) => {
            if (strCollection == 'db')
                return true;
            if(objCollections[strCollection] && !isClean)
                return true;
            
            if (objData[strCollection] ?.arrData ?.length) {
                    await db.collection(strCollection).insertMany(objData[strCollection] ?.arrData);
                }
            if (objData[strCollection] ?.arrIndex ?.length) {
                console.log("INSERTING INTO => ", strCollection);
                Promise.all(objData[strCollection] ?.arrIndex.map(async arrIndex => {
                    await db.collection(strCollection).createIndex(arrIndex[0], arrIndex[1]);
                }))
            }
        }));

    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
    } finally {
        console.log("EXECUTION COMPLETED!!");
    }
});