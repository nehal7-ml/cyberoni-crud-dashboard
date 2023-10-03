import { NextRequest, NextResponse } from 'next/server';
import errorHandler from "./errorHandler";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export default function apiHandler(handler: any) {
    const wrappedHandler: { 'GET'?: any, 'POST'?: any, 'PUT'?: any, 'PATCH'?: any, 'DELETE'?: any } = {};
    const httpMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    // wrap handler methods to add middleware and global error handler
    httpMethods.forEach(method => {
        if (typeof handler[method] !== 'function')
            return;

        wrappedHandler[method] = async (req: NextRequest, ...args: any) => {
            try {
                // monkey patch req.json() because it can only be called once
                const json = await req.json();
                req.json = () => json;
            } catch { }

            try {
                // route handler
                return await handler[method](req, ...args);
                
            } catch (err: any) {
                // global error handler
                return errorHandler(err);
            }
        };
    });

    return wrappedHandler;
}