// import PropTypes from "prop-types";

function Card({ title, description, imgUrl }) {
  return (
    <div className="roundend-md bg-zinc-950">
      <img src={imgUrl} alt="" />
      <div>
        <h2 className="text-2xl">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}

// Card.propTypes = {
//   title: PropTypes.string.isRequired,
// };

export default Card;
