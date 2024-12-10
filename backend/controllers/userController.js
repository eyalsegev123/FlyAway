const registerUser = (req, res) => {
  const { username, email, password } = req.body;

  // TODO: Add database logic to save the user
  res
    .status(201)
    .json({
      message: "User registered successfully",
      user: { username, email },
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  // TODO: Add database logic to authenticate the user
  res
    .status(200)
    .json({ message: "User logged in successfully", token: "exampleToken123" });
};

module.exports = { registerUser, loginUser };
