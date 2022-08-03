export class GenericRepoImplementation {
    constructor(idGenerator) {
        this.idGenerator = idGenerator;
        this.entities = new Map();
    } //DI dependency injection
    findAll() {
        return Array.from(this.entities.values());
    }
    findById(id) {
        return this.entities.get(id);
    }
    create(entity) {
        this.idGenerator.getNextId(); // assign unique id
        this.entities.set(entity.id, entity);
        return entity;
    }
    update(entity) {
        const old = this.findById(entity.id);
        if (old === undefined) {
            throw new Error(`Entity with ID='${entity.id}' does not exist.`);
        }
        this.entities.set(entity.id, entity);
        return entity;
    }
    deleteById(id) {
        const old = this.findById(id);
        if (old === undefined) {
            throw new Error(`Entity with ID='${id}' does not exist.`);
        }
        this.entities.delete(id);
        return old;
    }
    count() {
        return this.entities.size;
    }
}
//# sourceMappingURL=GenericRepository.js.map