import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
 
 const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else if (i - rating < 1) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
      }
    }
    return stars;
  };

export default renderStars