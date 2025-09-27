import React, { useState } from "react";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserBehaviorMutation,
  useDeleteUserMutation,
} from "./services/apiService";

const UserManager = () => {
  const { data: users, isLoading } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserBehaviorMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [newUser, setNewUser] = useState({ name: "", behavior: "" });

  const handleAdd = async () => {
    if (!newUser.name || !newUser.behavior) return;
    await addUser(newUser);
    setNewUser({ name: "", behavior: "" });
  };

  const handleUpdate = async (user) => {
    const updated = prompt("Update behavior:", user.behavior);
    if (updated !== null) {
      await updateUser({ id: user._id, body: { behavior: updated } });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteUser(id);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">👤 Users</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="User name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border px-2 py-1 mr-2"
        />
        <input
          type="text"
          placeholder="Behavior"
          value={newUser.behavior}
          onChange={(e) => setNewUser({ ...newUser, behavior: e.target.value })}
          className="border px-2 py-1 mr-2"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1">
          Add User
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {users?.map((user) => (
            <li
              key={user._id}
              className="border p-2 flex justify-between items-center"
            >
              <div>
                <strong>{user.name}</strong>: {user.behavior}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleUpdate(user)}
                  className="bg-yellow-500 text-white px-3 py-1"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-600 text-white px-3 py-1"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserManager;
