import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../../lib/auth';

export default async function products(req: NextApiRequest, res: NextApiResponse) {
    const {
        body,
        query: { pid },
        method,
    } = req;

    switch (method) {
        case 'GET':
            try {
                const { page, limit } = req.query
                const { accessToken, storeHash } = await getSession(req);
                const bigcommerce = bigcommerceClient(accessToken, storeHash);

                const bcRes = await bigcommerce.get(`/segments?limit=${limit ? limit : '50'}${page ? `&page=${page}` : ''}`);
                res.status(200).json(bcRes);
            } catch (error) {
                const { message, response } = error;
                res.status(response?.status || 500).json({ message });
            }
            break;
        case 'PUT':
            try {
                // const { accessToken, storeHash } = await getSession(req);
                // const bigcommerce = bigcommerceClient(accessToken, storeHash);

                // const { data } = await bigcommerce.put(`/catalog/products/${pid}`, body);
                // res.status(200).json(data);
            } catch (error) {
                // const { message, response } = error;
                // res.status(response?.status || 500).json({ message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'POST', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }


}
