'use strict';


class Collection {
    constructor(model) {
        this.model = model;
    }

    async read(id = null) {
        try {
            let record;
            if (id) {
                record = await this.model.findOne({ where: { id } })
            } else {
                record = await this.model.findAll();
            }
            return record;
        } catch (e) {
            console.error('Collection read error', e);
            return e;
        }
    }

    async create(json) {
        // console.log('this is our json', json);
        try {
            let record = await this.model.create(json);
            return record;
        } catch (e) {
            console.error('Collection create error', e);
            return e;
        }
    }


    async update(json, id) {
        try {
            await this.model.update(json, { where: { id } });
            return await this.model.findOne({ where: { id } });
        } catch (e) {
            console.error('Collection update error', e);
            return e;
        }
    }

    async delete(id) {
        await this.model.destroy({ where: { id } });
        return 'item deleted', id;
    }
};

module.exports = Collection;
