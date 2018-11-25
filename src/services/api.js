// client/src/api.js

import axios from 'axios';

export default() => axios.create({ baseURL: 'http://mevn-template-server-doberste8.c9users.io' });
