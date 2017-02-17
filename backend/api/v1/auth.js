/**
 * Created by antonorlov on 17/02/2017.
 */

import {extend} from 'underscore';
import Config from 'models/config';
import rp from 'request-promise';
import btoa from 'btoa';

function* getToken() {
    let token;

    let options = {
        'method': 'POST',
        'headers': {
            'User-Agent': 'KNB-Comments-Lister',
            'Accept': 'application/json',
            'Authorization': `Basic btoa(${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET})`,
        },
        'json': true,
        'uri': `http://kanobu.ru/oauth/token/?grant_type=password&username=${process.env.USERNAME}&password=${process.env.PASSWORD}`,
    };

    // POST to get token
    let data;
    try {
        data = yield rp(options);
    } catch (e) {
        throw e;
    }

    // If got access token - save it to DB and calculate expiry time
    if (data.access_token) {
        let entry;
        try {
            entry = yield new Config({
                'name': 'knb_token',
                'value': extend(data, {
                    'expires_at': Date.now() + data.expires_in,
                }),
            }).save();
        } catch (e) {
            throw e;
        }
        token = entry.value.access_token;
    } else {
        throw new Error('No accessToken received');
    }

    return token;
}

function* refreshToken(old_token) {
    let token;

    let options = {
        'method': 'POST',
        'headers': {
            'User-Agent': 'KNB-Comments-Lister',
            'Accept': 'application/json',
            'Authorization': `Basic ${btoa(process.env.CLIENT_ID + ' : ' + process.env.CLIENT_SECRET)}`,
        },
        'json': true,
        'uri': `http://kanobu.ru/oauth/token/?grant_type=refresh_token&refresh_token=${old_token.value.refresh_token}`,
    };

    // POST to refresh token
    let data;
    try {
        data = yield rp(options);
    } catch (e) {
        throw e;
    }

    // If got access token - update it in the DB
    if (data.access_token) {
        extend(old_token.value, extend(data, {
            'expires_at': Date.now() + data.expires_in,
        }));
        let entry;
        try {
            entry = old_token.save();
        } catch (e) {
            throw e;
        }

        token = entry.value.access_token;
    } else {
        throw new Error('No accessToken received');
    }

    return token;
}

/**
 * Gets data from Kanobu API (manages tokens automatically)
 * @param url Kanobu API handler to get
 * @param type Request type: POST or GET
 * @returns Promise
 */
function* knbApi(url, type) {
    let accessToken;
    try {
        accessToken = yield* Config.findOne({'name': 'access_token'}).exec();
    } catch (e) {
        throw e;
    }

    if (!accessToken) {
        try {
            accessToken = yield* getToken();
        } catch (e) {
            throw e;
        }
    } else if (accessToken.value.expires_at < Date.now()) {
        try {
            accessToken = yield* refreshToken(accessToken);
        } catch (e) {
            throw e;
        }
    }

    let options = {
        'method': type || 'GET',
        'headers': {
            'User-Agent': 'KNB-Comments-Lister',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        'json': true,
        'uri': `https://kanobu.ru/api${url}`,
    };

    return rp(options);
}

export {knbApi as default};
