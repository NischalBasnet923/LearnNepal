const CustomButton = ({ text, onClick, bgColor = 'bg-black', textColor = 'text-white' }) => (
  <button
    className={`${bgColor} ${textColor} w-full h-[50px] border p-2 rounded-xl font-semibold hover:bg-black hover:text-white`}
    onClick={onClick}
  >
    {text}
  </button>
);

export default CustomButton;