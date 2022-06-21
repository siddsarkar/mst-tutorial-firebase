import { observer } from 'mobx-react-lite';

import WishListItemEntry from './WishListItemEntry';
import WishListItemView from './WishListItemView';

const WishListView = ({ wishList, readonly }) => (
  <div className="list">
    <ul>
      {wishList.items.map((item, idx) => (
        <WishListItemView key={idx} item={item} readonly={readonly} />
      ))}
    </ul>
    Total: {wishList.totalPrice} €
    {!readonly && <WishListItemEntry wishList={wishList} />}
  </div>
);

export default observer(WishListView);
