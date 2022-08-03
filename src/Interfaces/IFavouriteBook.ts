import { idType, idTypeInterface } from "./IAnnotations";

export interface ifavouriteBook  extends idTypeInterface{
     // id: string,   come from idTypeInterface string|number
     volumeInfo: {
          title: string,
          imageLinks: {
               thumbnail: string,
          },
          description: string,
          authors: string,
          publishedDate: string,
     }
}


export class IFavBookImpl implements ifavouriteBook{
  constructor(
     public id:idType,
     public volumeInfo:{
          title:string,
          imageLinks:{
               thumbnail:string
          },
          description:string,
          authors:string,
          publishedDate:string
     } ) {}
}
