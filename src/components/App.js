import { useState } from 'react';
import logo from '../assets/santa-claus.png';

import { observer } from 'mobx-react-lite';
import WishListView from './WishListView';

function App(props) {
  const [selected, setSelected] = useState(null);
  const { group } = props;

  const selectedUser = group.users.get(selected);

  const onSelectUser = (event) => {
    setSelected(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">WishList</h1>
      </header>
      <button onClick={group.reload}>Reload</button>
      <select onChange={onSelectUser}>
        <option>- Select user -</option>
        {/* Array.from converts an iterable to array, so that we can map over it */}
        {Array.from(group.users.values()).map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button onClick={group.drawLots}>Draw lots</button>
      {selectedUser && <User user={selectedUser} />}
    </div>
  );
}

const User = observer(({ user }) => (
  <div>
    <WishListView wishList={user.wishList} />
    <button onClick={user.getSuggestions}>Suggestions</button>
    <hr />
    <h2>{user.recipient ? user.recipient.name : ''}</h2>
    {user.recipient && (
      <WishListView wishList={user.recipient.wishList} readonly />
    )}
  </div>
));

export default observer(App);
