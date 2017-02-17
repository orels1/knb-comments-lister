/**
 * Created by antonorlov on 17/02/2017.
 */
import express from 'express';
let router = express.Router();
import knbApi from './auth';

router.get('/list', (req, res) => {
    knbApi('/shouts/')
        .then((results) => {
            return knbApi(results.results[0].answers);
        })
        .then((answers) => {
            res.status(200).send({
                'error': false,
                'results': {
                    'list': answers,
                },
            });
        })
        .catch((err) => {
            throw err;
        });
});

export {router};
