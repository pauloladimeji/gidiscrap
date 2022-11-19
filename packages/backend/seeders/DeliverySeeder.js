const db = require('../app/models');

const Delivery = db.deliveries;
const Collector = db.collectors;
const Requests = db.requests;



const getRandom = (array) => array[Math.floor(Math.random() * array.length)];

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });


let seedDeliveries = [
  {
    delivery_size: 3000,
    delivery_fees: 2400,
    delivery_proof: '09028950691',
    delivery_time: '2022-10-12',
    delivery_status: true,
  },
  {
    delivery_size: 2355760,
    delivery_fees: 97879000,
    delivery_proof: '09028950691',
    delivery_time: '2022-10-12',
    delivery_status: false,
  },
  {
    delivery_size: 600,
    delivery_fees: 3200,
    delivery_proof: '09028950691',
    delivery_time: '2022-10-12',
    delivery_status: true,
  },
  {
    delivery_size: 799000,
    delivery_fees: 400,
    delivery_proof: '09028950691',
    delivery_time: '2022-10-12',
    delivery_status: true,
  },
  {
    delivery_size: 67900,
    delivery_fees: 43000,
    delivery_proof: '09028950691',
    delivery_time: '2022-10-12',
    delivery_status: false,
  }
];

const seedDB = async () => {
  /*
    Select one of 3 random collectors & requests, and add to each delivery
  */
  const promises = await Promise.all([
    Collector.aggregate([{ $sample: { size: 3 } }]),
    Requests.aggregate([{ $sample: { size: 3 } }]),
  ]);
  seedDeliveries = seedDeliveries.map((deliveries) => {
    const modified_deliveries = deliveries;
    modified_deliveries.collector = getRandom(promises[0])._id;
    modified_deliveries.request = getRandom(promises[1])._id;
    return modified_deliveries;
  });
  await Delivery.deleteMany({});
  await Delivery.insertMany(seedDeliveries);
};

seedDB().then(() => {
  db.mongoose.connection.close();
});
