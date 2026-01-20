//part 1 =========================================================
const express = require("express");
const fs = require("fs");
const path = require("path");

// const app = express();
app.use(express.json());

// const USERS_FILE = path.join(__dirname, "users.json");

// Helper functions
async function readUsers() {
  const data = await fs.readFile("users.json", { encoding: "utf-8" });
  return JSON.parse(data);
}

async function writeUsers(users) {
  await fs.writeFileSync("users.json", JSON.stringify(users), "utf-8");
}

//////////////////////////////////////////////////
// 1️⃣ Add new user
// POST /user
//////////////////////////////////////////////////
app.post("/user", async (req, res) => {
  try {
    const { name, age, email } = req.body;

    if (!name || !age || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const users = await readUsers();

    const emailExists = users.some((u) => u.email === email);
    if (emailExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      age,
      email,
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//////////////////////////////////////////////////
// 2️⃣ Update user by ID
// PATCH /user/:id
//////////////////////////////////////////////////
app.patch("/user/:id", async (req, res) => {
  //params
  try {
    const { id } = req.params;
    const { name, age, email } = req.body;

    const users = await readUsers();
    const userIndex = users.findIndex((u) => u.id == id);

    if (userIndex == -1) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name) users[userIndex].name = name;
    if (age) users[userIndex].age = age;
    if (email) {
      const emailExists = users.find((u) => u.email === email);
      if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }
    users[userIndex].email = email;

    await writeUsers(users);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//////////////////////////////////////////////////
// 3️⃣ Delete user by ID
// DELETE /user/:id
//////////////////////////////////////////////////
app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const users = await readUsers();
    const newUsers = users.filter((u) => u.id == id);

    if (users.length === newUsers.length) {
      return res.status(404).json({ message: "User not found" });
    }

    await writeUsers(newUsers);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//////////////////////////////////////////////////
// 4️⃣ Get user by name
// GET /user/getByName?name=Ali
//////////////////////////////////////////////////
app.get("/user/getByName", async (req, res) => {
  //query
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(404).json({ message: "Name is required" });
    }
    const users = await readUsers();
    const filterByName = users.filter((u) =>
      u.name.toLowerCase().has(name.toLocaleLowerCase()),
    );

    return res.status(200).json({ message: "success", filterByName });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//////////////////////////////////////////////////
// 5️⃣ Get all users
// GET /user
//////////////////////////////////////////////////
app.get("/user", async (req, res) => {
  try {
    const users = await readUsers();
    return res.status(200).json({ message: "users", users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//////////////////////////////////////////////////
// 6️⃣ Filter users by minimum age
// GET /user/filter?age=20
//////////////////////////////////////////////////
app.get("/user/filter", async (req, res) => {
  try {
    const minAge = Number(req.query.age);

    if (!minAge) {
      return res.status(400).json({ message: "Age query param is required" });
    }

    const users = await readUsers();
    const filteredUsers = users.filter((u) => u.age >= minAge);

    res.json(filteredUsers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//////////////////////////////////////////////////
// 7️⃣ Get user by ID
// GET /user/:id
//////////////////////////////////////////////////
app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const users = await readUsers();
    const user = users.find((u) => u.id == id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//////////////////////////////////////////////////
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//part 2 ==================================================================================//

//image

//part 3 ==================================================================================//
// var longestCommonPrefix = function(strs) {
//     if (strs.length === 0) return "";

//     let prefix = strs[0];

//     for (let i = 1; i < strs.length; i++) {
//         while (strs[i].indexOf(prefix) !== 0) {
//             prefix = prefix.slice(0, -1);
//             if (prefix === "") return "";
//         }
//     }

//     return prefix;
// };

// longestCommonPrefix();
