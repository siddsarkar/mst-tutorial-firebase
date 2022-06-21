import { observer } from 'mobx-react-lite';
import {
  applySnapshot,
  clone as objectClone,
  getSnapshot,
} from 'mobx-state-tree';
import { useState } from 'react';

import WishListItemEdit from './WishListItemEdit';

function WishListItemView(props) {
  const { item, readonly } = props;

  const [clone, setClone] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const renderEditable = () => (
    <li className="item">
      <WishListItemEdit item={clone} />
      <button onClick={onSaveEdit}>💾</button>
      <button onClick={onCancelEdit}>❎</button>
    </li>
  );

  const onToggleEdit = () => {
    setIsEditing(!isEditing);
    setClone(objectClone(item));
  };

  const onCancelEdit = () => {
    setIsEditing(false);
  };

  const onSaveEdit = () => {
    applySnapshot(item, getSnapshot(clone));
    setIsEditing(false);
    setClone(null);
  };

  return isEditing ? (
    renderEditable()
  ) : (
    <li className="item">
      {item.image && <img src={item.image} />}
      <h3>{item.name}</h3>
      <span>{item.price} €</span>
      {!readonly && (
        <span>
          <button onClick={onToggleEdit}>✏</button>
          <button onClick={item.remove}>❎</button>
        </span>
      )}
    </li>
  );
}

export default observer(WishListItemView);
