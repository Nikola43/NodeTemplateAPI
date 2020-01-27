import {expect} from 'chai';

const request = require('request');

const promisifiedRequest = function (options: any) {
    return new Promise((resolve: Function, reject: Function) => {
        request(options, (error: Error, response: Response, body: any) => {
            if (response) {
                return resolve(response);
            }
            if (error) {
                return reject(error);
            }
        });
    });
};

describe('Center', () => {
    it('Get centers ', async () => {
        const options = {
            url: "http://localhost:3000/api/v1/centers",
            method: 'GET',
            headers: {
                'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicGF1bG8iLCJpYXQiOjE1ODAwOTA5OTIsImV4cCI6MTU4MDE3NzM5Mn0.zI_ZMo3ehKsfi8iy59P2uSFhhcqw1T5DdSU51ME-RNU'
            },
        };

        const response: any = await promisifiedRequest(options);
        expect(response.statusCode).equal(200)
    });

    it('Get by id found ', async () => {
        const options = {
            url: "http://localhost:3000/api/v1/centers/4",
            method: 'GET',
            headers: {
                'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicGF1bG8iLCJpYXQiOjE1ODAxMzU0MjgsImV4cCI6MTU4MDIyMTgyOH0.L_VpzQHnnYJRADY-TsfqUal_RfUT51FcJ9nml881tSI'
            },
        };

        const response: any = await promisifiedRequest(options);
        expect(response.statusCode).equal(200)
    });

    it('Get by id - not found', async () => {
        const options = {
            url: "http://localhost:3000/api/v1/centers/3433",
            method: 'GET',
            headers: {
                'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoicGF1bG8iLCJpYXQiOjE1ODAwOTA5OTIsImV4cCI6MTU4MDE3NzM5Mn0.zI_ZMo3ehKsfi8iy59P2uSFhhcqw1T5DdSU51ME-RNU'
            },
        };

        const response: any = await promisifiedRequest(options);
        expect(response.statusCode).equal(404)
    })
});
