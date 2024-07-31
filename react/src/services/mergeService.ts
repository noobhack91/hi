import _ from 'lodash';

class MergeService {
    merge(base: object, custom: object): object {
        const mergeResult = _.merge({}, base, custom);
        return this.deleteNullValuedKeys(mergeResult);
    }

    private deleteNullValuedKeys(currentObject: any): any {
        _.forOwn(currentObject, (value, key) => {
            if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                (_.isObject(value) && _.isNull(this.deleteNullValuedKeys(value)))) {
                delete currentObject[key];
            }
        });
        return currentObject;
    }
}

export default MergeService;
