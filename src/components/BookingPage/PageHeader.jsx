export function PageHeader({ step }) {
  const titles = {
    1: "Book a Class",
    2: "Confirm Details",
    3: "Booking Confirmed!",
  };

  const subtitles = {
    1: "Find the perfect time slot for your learning",
    2: "Review your booking before confirming",
    3: "You're all set!",
  };

  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
        {titles[step]}
      </h1>
      <p className="text-lg text-gray-600">{subtitles[step]}</p>
    </div>
  );
}
