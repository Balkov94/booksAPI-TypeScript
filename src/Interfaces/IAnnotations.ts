export type idType = number|string;

export interface idTypeInterface {
    id: idType  
}

export interface iAnnotation extends idTypeInterface{
     // id?:number,         // when edit id is the same nad don't pass it to f
     book:string,
     content:string,
     timeOFEdit:string,
     timeOfCreation:string,
     title:string
}