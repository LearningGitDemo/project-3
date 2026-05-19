const ChatMessage = require("../models/chatMessage");
const Booking = require("../models/booking");

// --- Rendering Chat Page ---
const renderChatPage = async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId)
  .populate("userId")
  .populate({
    path: "providerId",
    populate: {
      path: "userId",
      model: "User"
    }
  });

  console.log(booking);

  // --- valid user check ---
  if (!booking || (!booking.userId._id.equals(req.user.id) && !booking.providerId.userId.equals(req.user.id))
  ) {
    return res.status(403).send("---<h1>Not authorized</h1>----");
  }

  res.render("chat", {
    bookingId,
    currentUserId: req.user.id,
    user: booking.userId,
    provider: booking.providerId,
  });
};


// --- fetching old messages from database ---
const getMessages = async (req, res) => {
  const messages = await ChatMessage.find({
    bookingId: req.params.bookingId,
  }).sort({ sentAt: 1 });

  res.json(messages);
};
module.exports = {renderChatPage, getMessages};
