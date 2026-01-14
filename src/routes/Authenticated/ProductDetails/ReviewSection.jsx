import { useState } from "react";
import { Star, Send, User } from "lucide-react";
import api from "../../../lib/api";

export default function ReviewSection({ productId, reviews, onReviewSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/users/reviews", {
        productId,
        rating,
        comment: comment.trim(),
      });
      setSuccess(res.message || "Review submitted successfully!");
      setRating(0);
      setComment("");
      if (onReviewSubmit) onReviewSubmit();
    } catch (err) {
      setError(err.data?.error || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Customer Reviews ({reviews.length})
      </h3>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-1">Write a Review</h4>
        <p className="text-xs text-gray-500 mb-4">
          You can only review products after your order has been completed.
        </p>

        {/* Star Rating */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600">Your Rating:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  size={24}
                  fill={star <= (hoverRating || rating) ? "#FCD34D" : "none"}
                  className={
                    star <= (hoverRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product (optional)"
          rows={3}
          maxLength={500}
          className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 resize-none mb-3"
        />

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-[#FCD34D] text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-[#FBBF24] transition-colors disabled:opacity-50"
        >
          <Send size={16} />
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* Existing Reviews */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border border-gray-100 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-600">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">
                      {review.user?.firstName} {review.user?.lastName?.[0]}.
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? "#FCD34D" : "none"}
                        className={
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}
