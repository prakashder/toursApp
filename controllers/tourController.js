
const mongoose = require('mongoose');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');


exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next()

}


exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query);
        //BUILD QUERY

        // 1A) Filtering
        // const queryObj = { ...req.query };
        // const excludedFields = ['page', 'sort', 'limit', 'fields']
        // excludedFields.forEach((el) => delete queryObj[el]);

        // // 1B) Advance Filtering
        // let queryStr = JSON.stringify(queryObj)
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        //{difficulty:'easy',duration:{$gte:5}}
        //{difficulty:'easy',duration:{gte:'5'}}

        // let query = Tour.find(JSON.parse(queryStr));

        // // 2) Sorting
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(",").join(" ");
        //     query = query.sort(sortBy);
        // } else {
        //     query = query.sort('-createdAt');
        // }

        // //3) Field limiting
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(",").join(" ");
        //     query = query.select(fields);
        // }
        // else {
        //     query = query.select('-__v')
        // }

        // // 4) Pagination
        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 5;
        // const skip = (page - 1) * 5

        // //page=3&limit=10,1-10 ,page 1 11-20 page 2,21-30 page 3
        // query = query.skip(skip).limit(limit);

        // if (req.query.page) {
        //     const numTours = await Tour.countDocuments();
        //     if (skip >= numTours) throw new Error('This page does not exists');
        // }

        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;
        // const query=Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

        //SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // Tour.findById({_id:req.params.id});
        res.status(200).json({
            status: 'success',

            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.createTour = async (req, res) => {
    try {

        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        // Log the request parameters and body for debugging
        // console.log('Updating tour with ID:', req.params.id);
        // console.log('Request body:', req.body);

        // Find and update the tour
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,       // Return the modified document
            runValidators: true // Ensure the update adheres to the schema
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};




exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
