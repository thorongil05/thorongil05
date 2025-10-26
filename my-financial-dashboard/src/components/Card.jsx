import PropTypes from "prop-types";

function Card({ title, description, isVisited, imgUrl }) {
  return (
    <div className="roundend-md bg-zinc-950">
      <img src={imgUrl} alt="" />
      <div>
        <h2 className="text-2xl">{title}</h2>
        <p className="text-gray-500">{description}</p>
        {isVisited && <span>✅ Visitata</span>}
        {!isVisited && <span>❌ Non Visitata</span>}
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isVisited: PropTypes.bool.isRequired,
  imgUrl: PropTypes.string.isRequired,
};

export default Card;
