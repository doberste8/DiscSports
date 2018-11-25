// client/src/api.js

import axios from 'axios';

export default() => axios.create({ baseURL: 'http://disc-sports.bid:3000' });
