import { useState } from "react";
import "./index.css";

export default function App() {
  const [friend, setFriend] = useState([]);
  const [showfriend, setShowfriend] = useState(true);
  const [selectFriend, setSelectFriend] = useState(null);

  function handleToggle() {
    setShowfriend((showfriend) => !showfriend);
  }

  function handleSubmit(obj) {
    setFriend((friend) => [...friend, obj]);
    setShowfriend(false);
  }

  function handleSelect(person) {
    setSelectFriend((per) => (per?.id === person?.id ? null : person));
    setShowfriend(false);
  }

  function handleBillSplit(value) {
    setFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  const [name, setName] = useState("");
  const [Image, setImage] = useState("https://i.pravatar.cc/48");

  return (
    <div className="app">
      <div className="sidebar">
        <Friends
          friend={friend}
          onSelect={handleSelect}
          selectFriend={selectFriend}
        />
        <Forms
          showfriend={showfriend}
          name={name}
          Image={Image}
          setName={setName}
          setImage={setImage}
          onAdd={handleSubmit}
        />
        <Button onClick={handleToggle}>
          {showfriend ? "Close" : "Add a Friend"}
        </Button>
      </div>
      {selectFriend && (
        <FormSplitBill selectFriend={selectFriend} onSplit={handleBillSplit} />
      )}
    </div>
  );
}

function Friends({ friend, onSelect, selectFriend }) {
  return (
    <ul>
      {friend.map((tomodachi) => (
        <FriendsList
          key={tomodachi.id}
          tomodachi={tomodachi}
          onSelect={onSelect}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}

function FriendsList({ tomodachi, onSelect, selectFriend }) {
  const isSelected = selectFriend?.id === tomodachi?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={tomodachi.Image} alt={tomodachi.name} />
      <h3>{tomodachi.name}</h3>

      {tomodachi.balance < 0 && (
        <p className="green">
          You owe {tomodachi.name} {Math.abs(tomodachi.balance)}
        </p>
      )}
      {tomodachi.balance > 0 && (
        <p className="red">
          {tomodachi.name} owes you {tomodachi.balance}
        </p>
      )}
      {tomodachi.balance === 0 && (
        <p className="black">You and {tomodachi.name} are even</p>
      )}
      <Button onClick={() => onSelect(tomodachi)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function Forms({ showfriend, name, Image, setName, setImage, onAdd }) {
  const id = crypto.randomUUID();
  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !Image) return;
    const newFriend = {
      id,
      name,
      Image: `${Image}?=${id}`, //TO make a fixed image URL.
      balance: 0,
    };
    onAdd(newFriend);
    setImage("https://i.pravatar.cc/48");
    setName("");
  }

  return (
    showfriend && (
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>🌇 Friend Name </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>🌇Image URL </label>
        <input
          type="text"
          value={Image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Button>Add</Button>
      </form>
    )
  );
}
function FormSplitBill({ selectFriend, onSplit }) {
  const [bill, setBill] = useState(0);
  const [pay, setPay] = useState(0);
  const [whoispaying, setwhoispaying] = useState("me");

  const friendPay = bill ? bill - pay : 0;

  function handleForm(e) {
    e.preventDefault();
    if (!bill || !pay) return;
    onSplit(whoispaying === "me" ? friendPay : -friendPay);
  }

  if (!selectFriend) {
    return null;
  }

  return (
    <form className="form-split-bill" onSubmit={handleForm}>
      <h2>SPLIT A BILL WITH {selectFriend.name} </h2>
      <label>* Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>* Your expense</label>
      <input
        type="number"
        value={pay}
        onChange={(e) => setPay(Number(e.target.value))}
      />
      <label>* {selectFriend.name}'s expense</label>
      <input type="number" disabled value={friendPay} />

      <label>* Who is paying the Bill?</label>
      <select
        value={whoispaying}
        onChange={(e) => setwhoispaying(e.target.value)}
      >
        <option>{selectFriend.name}</option>
        <option>Me</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
