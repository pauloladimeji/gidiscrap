const db = require('../models');

const Request = db.requests;
const Delivery = db.deliveries;
const Collector = db.collectors;
const Location = db.locations;
const Company = db.companies;
const Category = db.categories;
const CollectionCenter = db.collectioncenter;

module.exports = {
  getRequestDeliveries: async (req, res) => {
    // const { id: requestId } = req.query;
    const { id } = req.params;

    try {
      const request = await Request.findById(id).exec();
      if (!request) {
        return res.status(404).json({
          status: false,
          message: `Could not find request of ID ${id}`,
        });
      }
      const deliveries = await Delivery.find({ request: id }).populate({
        path: 'collector',
        model: Collector,
      }).populate({
        path: 'request',
        model: Request,
      });
      return res.json({ success: true, data: deliveries });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message:
          error.message ||
          `There was an error getting this request's deliveries`,
      });
    }
  },
  getDeliveryDetails: async () => {},
  getAllDeliveries: async (req, res) => {
    let { page, size } = req.query;
    let deliveries;

    try{

      
      if (!page) {
        // Make the Default value one
        page = 1;
      }

      if (!size) {
        size = 5;
      }

      // return console.log(page, size)


      const limit = parseInt(size, 5);
      deliveries = await Delivery.find({}).sort({ id: -1 }).limit(limit)
      .populate({
        path: 'collector',
        model: Collector,
      }).populate({
        path: 'request',
        populate: {
          path: "company",
          model: Company,
        },
        model: Request,
      }).populate({
        path: 'request',
        populate: {
          path: "collection_center",
          model: CollectionCenter,
        },
        model: Request,

      }).populate({
        path: 'request',
        populate: {
          path: "location",
          model: Location,
        },
        model: Request,

      }).populate({
        path: 'request',
        populate: {
          path: "scrap_category",
          model: Category,
          populate: { path: 'children', model: Category }
        },
        model: Request,
      }).populate({
        path: 'request',
        populate: {
          path: "scrap_subcategory",
          model: Category,
        },
        model: Request,
      });

      

      const count = await Delivery.find({}).count();
      return res.json({ success: true, count, page, size, data: deliveries })

    }catch(err){
      console.log(err)
    }
  },
  startDelivery: async () => {},
};
