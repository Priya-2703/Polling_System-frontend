import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate()

  return (
    <>
      <div className="containter mx-auto">
        <div className="w-[90%] mx-auto h-dvh relative flex flex-col">
          <div className="flex justify-center items-start pt-4">
            <h1 className="text-[20px] font-heading text-center uppercase font-black tracking-wide leading-6 text-transparent bg-linear-to-r from-accet to-[#017474] bg-clip-text">
              Tamil Nadu 2026 Election Opinion Poll
            </h1>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <div>
              <img
                src="https://ik.imagekit.io/saransk03/Voting%20Poll/Google_AI_Studio_2025-12-27T06_07_01.312Z.png"
                alt="img"
                className="w-56"
              />
            </div>
          </div>

          <div className="w-full absolute bottom-4">
            <button
            onClick={()=> navigate("/form")}
            className="w-full font-heading text-[12px] tracking-wider rounded-full text-white bg-accet/30 uppercase font-bold border border-accet flex justify-center items-center">
              Start<span><img src="https://ik.imagekit.io/saransk03/Voting%20Poll/Photoroom-20251227_104203323.png" className="w-12" /></span>Voting in Lunai
            </button>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-52 w-52 bg-blue-500/60 rounded-full blur-3xl -z-10" />
        </div>
      </div>
    </>
  );
};

export default Home;