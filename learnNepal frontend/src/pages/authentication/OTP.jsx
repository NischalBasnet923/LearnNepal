import CustomButton from "../../components/basic components/button";

const OTP = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl rounded-xl">
      <div className="w-[500px] rounded-2xl px-10 py-10 pb-14 text-center border border-gray-100 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <p>Arrow Back</p>
          <p>x</p>
        </div>
        <h1 className="text-2xl font-medium mb-3">Enter OTP</h1>
        <p className="text-[12px] text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
          consectetur varius ligula, sit amet gravida diam dapibus et. Quisque
          imperdiet.
        </p>
        <form action="post" className="px-7">
          <div className="flex gap-6 drop-shadow-md mb-8">
            <input
              type="text"
              maxLength={1}
              className="w-[52px] h-[52px] border border-gray-100 rounded-md text-center text-2xl"
            />
            <input
              type="text"
              maxLength={1}
              className="w-[52px] h-[52px] border border-gray-100 rounded-md text-center text-2xl"
            />
            <input
              type="text"
              maxLength={1}
              className="w-[52px] h-[52px] border border-gray-100 rounded-md text-center text-2xl"
            />
            <input
              type="text"
              maxLength={1}
              className="w-[52px] h-[52px] border border-gray-100 rounded-md text-center text-2xl"
            />
            <input
              type="text"
              maxLength={1}
              className="w-[52px] h-[52px] border border-gray-100 rounded-md text-center text-2xl"
            />
          </div>
          <div className="text-sm text-gray-500 mb-8">
            <p>Didn&apos;t receive code ?</p>
            <p>Request Again (00:00:29)</p>
          </div>
          <CustomButton text="Next" onClick={() => {}} />
        </form>
      </div>
    </div>
  );
};

export default OTP;