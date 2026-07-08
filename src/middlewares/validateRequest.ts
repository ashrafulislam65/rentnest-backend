import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod'; 

export const validateRequest = (schema: ZodType<any, any, any>) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            req.body = (parsed as any).body ?? req.body;
            req.query = (parsed as any).query ?? req.query;
            req.params = (parsed as any).params ?? req.params;

            return next();
        } catch (error: any) {
            return next(error);
        }
    };
};