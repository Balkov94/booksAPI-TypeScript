import { idType, idTypeInterface } from "../Interfaces/IAnnotations";
import { IdGenerator } from "./id-generator";

export interface IRepository<T extends idTypeInterface> {
     findAll(): T[];
     findById(id: idType): T | undefined;
     create(entity: T): T;
     update(entity: T): T;
     deleteById(id: idType): T;
     count(): number;
 }
 
 export class GenericRepoImplementation<T extends idTypeInterface> implements IRepository<T> {
     private entities = new Map<idType, T>();
 
     constructor(private idGenerator: IdGenerator<idType>) { } //DI dependency injection
 
     findAll(): T[] {
         return Array.from(this.entities.values());
     }
     findById(id: idType): T | undefined {
         return this.entities.get(id);
     }
     create(entity: T): T {
         this.idGenerator.getNextId(); // assign unique id
         this.entities.set(entity.id, entity);
         return entity;
     }
     update(entity: T): T {
         const old = this.findById(entity.id);
         if (old === undefined) {
             throw new Error(`Entity with ID='${entity.id}' does not exist.`);
         }
         this.entities.set(entity.id, entity);
         return entity;
     }
     deleteById(id: number): T {
         const old = this.findById(id);
         if (old === undefined) {
             throw new Error(`Entity with ID='${id}' does not exist.`);
         }
         this.entities.delete(id);
         return old;
     }
     count(): number {
         return this.entities.size;
     }
 }

