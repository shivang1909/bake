import React, { useEffect, useState } from "react";

const initialRatingsData = [
  { key: 5, label: "Excellent", value: 0, percent: 0, color: "bg-green-600" },
  { key: 4, label: "Very Good", value: 0, percent: 0, color: "bg-green-400" },
  { key: 3, label: "Good", value: 0, percent: 0, color: "bg-yellow-400" },
  { key: 2, label: "Average", value: 0, percent: 0, color: "bg-orange-400" },
  { key: 1, label: "Poor", value: 0, percent: 0, color: "bg-red-500" },
];

export default function RatingBar({ ratingstats}) {
  const [ratingsData, setRatingsData] = useState(initialRatingsData);
  
  console.log("Rating stats:", ratingstats);
  useEffect(() => {
    if (ratingstats) {
      const total = ratingstats.reduce((sum, item) => sum + item.count, 0);

      const updatedRatings = initialRatingsData.map((rating) => {
        const match = ratingstats.find((stat) => stat._id === rating.key);
        const count = match ? match.count : 0;
        const percent = total > 0 ? (count / total) * 100 : 0;

        return {
          ...rating,
          value: count,
          percent: Math.round(percent),
        };
      });

      setRatingsData(updatedRatings);
    }
  }, [ratingstats]);

  return (
    <div>
      {ratingsData.map((item, index) => (
        <div key={index} className="flex items-center justify-between mb-2">
          <span className="w-20 text-sm text-gray-700">{item.label}</span>
          <div className="flex-1 mx-2 bg-gray-100 rounded h-2 relative">
            <div
              className={`${item.color} h-2 rounded absolute`}
              style={{ width: `${item.percent}%` }}
            />
          </div>
          <span className="text-sm text-gray-500">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
