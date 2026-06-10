

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const feedbacks = [
  {
    id: 1,
    name: "Aarav S.",
    project: "Aurora Web",
    time: "2m ago",
    rating: 5,
    comment: "The new onboarding is buttery smooth. Loving it.",
    avatar: "A",
    avatarBg: "bg-emerald-100",
    avatarColor: "text-emerald-600",
  },
  {
    id: 2,
    name: "Mia K.",
    project: "Pulse iOS",
    time: "14m ago",
    rating: 4,
    comment: "Charts load fast now. Dark mode could use more contrast.",
    avatar: "M",
    avatarBg: "bg-gray-100",
    avatarColor: "text-gray-600",
  },
  {
    id: 3,
    name: "Lukas R.",
    project: "Pulse Android",
    time: "38m ago",
    rating: 5,
    comment: "Push notifications finally reliable. Great work.",
    avatar: "L",
    avatarBg: "bg-amber-100",
    avatarColor: "text-amber-600",
  },
  {
    id: 4,
    name: "Priya N.",
    project: "Beacon Web",
    time: "1h ago",
    rating: 3,
    comment: "Filters reset on tab switch — small bug.",
    avatar: "P",
    avatarBg: "bg-pink-100",
    avatarColor: "text-pink-600",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function RecentFeedback() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-xl border border-gray-100 p-4 h-full"
    >
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base text-gray-800"  style={{ fontFamily: 'Jura', fontWeight: '700' }}>Recent feedback</h3>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbacks.map((feedback, index) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.08 }}
            className="pb-4 border-b border-gray-50 last:border-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full ${feedback.avatarBg} flex items-center justify-center flex-shrink-0`}
              >
                <span className={`text-sm font-medium ${feedback.avatarColor}`}>
                  {feedback.avatar}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm text-gray-900" style={{ fontFamily: 'sans-serif', fontWeight: '500' }}>
                      {feedback.name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {feedback.project} · {feedback.time}
                    </p>
                  </div>
                  <StarRating rating={feedback.rating} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mt-1.5">
                  {feedback.comment}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
