const PDetail = ({ content, value, tamaño }) => {
  return (
    <div className="flex flex-wrap">
      <p className={`${tamaño ? tamaño : "text-xl"}  text-gray-600 my-0`}>
        <strong className="text-gray-600 mr-2">{content}</strong>
        {value}
      </p>
    </div>
  );
};

export default PDetail