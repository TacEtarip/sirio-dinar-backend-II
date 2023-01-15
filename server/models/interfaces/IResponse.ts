import { Response } from 'express';

export interface IContentResponse extends Response {
  content: (body: any) => Response<any, Record<string, any>>;
}
