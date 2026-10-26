import express from 'express';
import { Router } from 'express';

const ticket = express.Router();

ticket.post('/', (req, res) => {
    console.log('post')
    res.status(201).json({
        message: 'hehe'
    });
})

ticket.get('/', (req, res) => {
    console.log('get')
    res.status(201).json({
        message: 'hehe'
    });
})

ticket.get('/:id', (req, res) => {

})

ticket.patch('/:id/assign', (req, res) => {

})

ticket.patch('/:id/status', (req, res) => {

})

export default ticket