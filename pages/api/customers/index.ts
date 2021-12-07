import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../lib/auth';


    /*  node-bigcommerce throws an error if response bodies include an
        'errors' property (https://github.com/getconversio/node-bigcommerce/blob/40b9fb2d948ff0fa2f19d31fbf872754fb6cfe35/lib/request.js#L24-L28)
        So, the batch APIs can't use that client until it's patched.
        I don't want to monkey patch it here, so I'm going to use axios instead
    */
const axios = require('axios').default

export default async function customers(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { 'id:in': ids, page, limit, 'name:like': name, 'email:in': emails },
        method,
    } = req;

    switch (method) {
        case 'GET':
            try {
                const { accessToken, storeHash } = await getSession(req);
                const bigcommerce = bigcommerceClient(accessToken, storeHash);
                const query = `include=segment_ids,shopper_profile_id${limit ? `&limit=${limit}` : ''}${page ? `&page=${page}` : ''}${ids ? `&id:in=${ids}` : ''}${name ? `&name:like=${name}` : ''}${emails ? `&email:in=${emails}` : ''}`
                const bcRes = await bigcommerce.get(`/customers?${query}`);
                res.status(200).json(bcRes);
            } catch (error) {
                const { message, response } = error;
                res.status(response?.status || 500).json({ message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }


}
