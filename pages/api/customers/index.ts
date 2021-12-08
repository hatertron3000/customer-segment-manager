import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../lib/auth';

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
