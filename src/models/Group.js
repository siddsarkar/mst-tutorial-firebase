import { applySnapshot, flow, types } from 'mobx-state-tree';

import { get, onValue, ref } from 'firebase/database';
import { db } from '../utils/firebase';
import { createStorable } from './Storable';
import { WishList } from './WishList';

const User = types.compose(
  types
    .model({
      id: types.identifier,
      name: types.string,
      gender: types.enumeration('gender', ['m', 'f']),
      wishList: types.optional(WishList, {}),
      recipient: types.maybe(types.reference(types.late(() => User))),
    })
    .actions((self) => {
      let userRef = ref(db, 'users/' + self.id);

      return {
        afterCreate() {
          onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            applySnapshot(self, data);
          });
        },
        beforeDestroy() {
          userRef.off();
        },
        getSuggestions: flow(function* getSuggestions() {
          const response = yield get(ref(db, `suggestions_${self.gender}`));
          self.wishList.items.push(...response.val());
        }),
      };
    }),
  createStorable('users', 'id')
);

export const Group = types
  .model({
    users: types.map(User),
    isLoading: false,
    error: types.maybe(types.string),
  })
  .actions((self) => ({
    afterCreate() {
      self.load();
    },
    load: flow(function* load() {
      self.isLoading = true;

      try {
        const response = yield get(ref(db, 'users/'));

        if (response.exists()) {
          const val = response.val();
          applySnapshot(self.users, val);
        }
      } catch (e) {
        console.log('aborted', e.name);
        self.error = e.name;
      } finally {
        self.isLoading = false;
      }
    }),
    reload() {
      self.load();
    },
    drawLots() {
      const allUsers = Array.from(self.users.values());

      // not enough users, bail out
      if (allUsers.length <= 1) return;

      // not assigned lots
      let remaining = allUsers.slice();

      allUsers.forEach((user) => {
        // edge case: the only person without recipient
        // is the same as the only remaining lot
        // swap lot's with some random other person
        if (remaining.length === 1 && remaining[0] === user) {
          const swapWith =
            allUsers[Math.floor(Math.random() * (allUsers.length - 1))];
          user.recipients = swapWith.recipient;
          swapWith.recipient = self;
        } else
          while (!user.recipient) {
            // Pick random lot from remaing list
            let recipientIdx = Math.floor(Math.random() * remaining.length);

            // If it is not the current user, assign it as recipient
            // and remove the lot
            if (remaining[recipientIdx] !== user) {
              user.recipient = remaining[recipientIdx];
              remaining.splice(recipientIdx, 1);
            }
          }
      });
    },
  }));
