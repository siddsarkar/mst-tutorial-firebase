import { ref, set } from 'firebase/database';
import { flow, getSnapshot, onSnapshot, types } from 'mobx-state-tree';
import { db } from '../utils/firebase';

export function createStorable(collection, attribute) {
  return types.model({}).actions((self) => ({
    save: flow(function* save() {
      try {
        yield set(
          ref(db, `${collection}/${self[attribute]}`),
          getSnapshot(self)
        );
      } catch (e) {
        console.error('Uh oh, failed to save: ', e);
      }
    }),
    afterCreate() {
      onSnapshot(self, self.save);
    },
  }));
}
