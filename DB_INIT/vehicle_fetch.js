const fetch = require('node-fetch');
const {
    ObjectId,MongoClient
} = require('mongodb');
let arrMakers = [
    "Acura",
    "Alfa_Romeo",
    "Aston_Martin", 
    "Audi",
    "BMW",
    "Bentley",
    "Buick",
    "Cadilla",
    "Chevrolet",
    "Chrysler",
    "Daewoo",
    "Daihatsu",
    "Dodge",
    "Eagle",
    "Ferrari",
    "Fiat",
    "Fisker",
    "Ford",
    "Freightliner",
    "GMC", 
    "Genesis",
    "Geo",
    "Honda",
    "Hummer",
    "Hyundai",
    "Infinity",
    "Isuzu",
    "Jaguar",
    "Jeep",
    "Kla",
    "Lamborghini",
    "Land_Rover", 
    "Lexus",
    "Lincoln",
    "Lotus",
    "MAZDA",
    "Maserati",
    "Maybach",
    "McLaren",
    "Mercedes_Benz",
    "Mercury",
    "Mini",
    "Mitsubishi",
    "Nissan",
    "Oldsmobile",
    "Panoz",
    "Plymouth",
    "Polestar",
    "Pontiac",
    "Porsche",
    "Ram",
    "Rivian",
    "Rolls_Royce",
    "Saab",
    "Saturn",
    "Smart",
    "Subaru",
    "Susuki",
    "Tesla",
    "Toyota",
    "Volkswagen",
    "Volvo"
]

const main = async ()=>{
    let Connection = await MongoClient.connect("mongodb://127.0.0.1:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
    });
    const db = await Connection.db("moiwash");
    const arrVehicleInsert = await arrMakers.map( maker=>({
        _id:new ObjectId(),
        "chrStatus": "N",
        "strType": "Car",
        "strName": maker,
    }));
    await db.collection("cln_vehicle").insertMany(arrVehicleInsert);
  let objModels = {

  }
  let objVehicleCount = {}
    await arrVehicleInsert.map(async vehicle=>{
    const response = await fetch(
        `https://parseapi.back4app.com/classes/Car_Model_List_${vehicle?.strName}?count=1&limit=1000000`,
        {
          headers: {
            'X-Parse-Application-Id': 'hlhoNKjOvEhqzcVAJ1lxjicJLZNVv36GdbboZj3Z', // This is the fake app's application id
            'X-Parse-Master-Key': 'SNMJJF0CZZhTPhLDIqGhTlUNV9r60M2Z5spyWfXW', // This is the fake app's readonly master key
          }
        }
      );
      const data = await response.json(); // Here you have the data that you need
      objVehicleCount[vehicle?.strName] = data?.results?.length
      await data.results.map(model=>{
        objModels[model.Model] = {
            _id:new ObjectId(),
            "chrStatus": "N",
            "strName": model.Model,
            "strModelType": model.Category =='Van/Minivan'?'Minivan':model.Category.split(',')[0],
            "strVehicleId": vehicle._id
        }
      });
    });
    setTimeout(async ()=>{
     console.log(arrMakers.length,Object.keys(objVehicleCount).length,"objVehicleCount",objVehicleCount);
     await db.collection("cln_vehicle_model").insertMany(Object.values(objModels));
    },10000)
}

main()